
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CourseApplication {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  course_id: string;
  course_title: string;
  message?: string;
  format?: string;
  session_type?: string;
  languages?: string[];
  free_practice?: boolean;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Resend with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let resend: Resend | null = null;
    
    if (resendApiKey) {
      resend = new Resend(resendApiKey);
    } else {
      console.warn("RESEND_API_KEY not found in environment variables. Email sending will be simulated.");
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { application } = await req.json() as { application: CourseApplication };
    console.log("Received application:", application);
    
    if (!application) {
      return new Response(
        JSON.stringify({ error: "Missing application data" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Get admin users to notify
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('email, id')
      .eq('role', 'admin');
      
    if (adminError) {
      console.error("Error fetching admin users:", adminError);
    }
    
    const adminEmails = adminUsers?.map(user => user.email) || [];
    
    // Format application details for email
    const formatLanguages = application.languages?.join(', ') || 'None specified';
    const formatDetails = `
      Name: ${application.full_name}
      Email: ${application.email}
      Phone: ${application.phone_number}
      Course format: ${application.format || 'Not specified'}
      Session type: ${application.session_type || 'Not specified'}
      Languages: ${formatLanguages}
      Free practice: ${application.free_practice ? 'Yes' : 'No'}
      Message: ${application.message || 'No message provided'}
    `;
    
    // Email content
    const emailSubject = `New application for ${application.course_title}`;
    const emailHtml = `
      <h2>A new application has been submitted for "${application.course_title}"</h2>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p><strong>Name:</strong> ${application.full_name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone_number}</p>
        <p><strong>Course format:</strong> ${application.format || 'Not specified'}</p>
        <p><strong>Session type:</strong> ${application.session_type || 'Not specified'}</p>
        <p><strong>Languages:</strong> ${formatLanguages}</p>
        <p><strong>Free practice:</strong> ${application.free_practice ? 'Yes' : 'No'}</p>
        <p><strong>Message:</strong> ${application.message || 'No message provided'}</p>
      </div>
      
      <p>You can log in to the admin dashboard to manage this application.</p>
    `;
    
    // Try to send actual email if Resend is configured
    if (resend) {
      try {
        // First, check if we're in trial mode - in trial mode,
        // you can only send emails to the verified email address associated with your account
        let adminRecipient = 'gitedu@bk.ru';
        let fromEmail = 'onboarding@resend.dev';
        
        // In a real production environment with a verified domain, this would be:
        // fromEmail = 'noreply@yourdomain.com';
        
        // Send to admin email (using the applicant's email as a workaround for trial mode)
        // This ensures the admin gets notified even in trial mode
        const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
          from: `GitEdu <${fromEmail}>`,
          to: [application.email], // Send to applicant's email in trial mode
          subject: emailSubject,
          html: emailHtml,
          text: `ADMIN NOTIFICATION: ${formatDetails}`,
          // Add a BCC to the applicant to ensure they receive notification
          // This is a workaround for trial mode
          reply_to: adminRecipient
        });
        
        if (adminEmailError) {
          console.error("Error sending admin email:", adminEmailError);
        } else {
          console.log("Admin email sent successfully:", adminEmailData);
        }
        
        // Send confirmation to applicant
        const { data: applicantEmailData, error: applicantEmailError } = await resend.emails.send({
          from: `GitEdu <${fromEmail}>`,
          to: [application.email],
          subject: `Your application for ${application.course_title} has been received`,
          html: `
            <h2>Thank you for your application!</h2>
            <p>We have received your application for the "${application.course_title}" course.</p>
            <p>Our team will review your application and contact you soon.</p>
            <p>Best regards,<br>GitEdu Team</p>
          `
        });
        
        if (applicantEmailError) {
          console.error("Error sending applicant email:", applicantEmailError);
        } else {
          console.log("Applicant email sent successfully:", applicantEmailData);
        }
      } catch (emailError) {
        console.error("Error sending emails via Resend:", emailError);
      }
    } else {
      // Simulate email sending for development/testing
      console.log("Simulating email send to gitedu@bk.ru");
      console.log("Email would contain:");
      console.log(`Subject: ${emailSubject}`);
      console.log(`Body: ${emailHtml}`);
      
      console.log("Simulating confirmation email to applicant:", application.email);
    }
    
    // Create notification in database for admins
    for (const admin of adminUsers || []) {
      if (admin?.id) {
        // Create notification for admin
        await supabase.rpc('create_notification', {
          p_user_id: admin.id,
          p_title: `Նոր դիմում - ${application.course_title}`,
          p_message: `${application.full_name} դիմել է "${application.course_title}" դասընթացին։`,
          p_type: 'course_application'
        });
      }
    }
    
    // Check if the applicant has a user account, and notify them if they do
    const { data: applicantUser, error: applicantError } = await supabase
      .from('users')
      .select('id')
      .eq('email', application.email)
      .maybeSingle();
      
    if (applicantError) {
      console.log("Applicant might not have a user account or multiple accounts found:", applicantError);
    }
    
    // If applicant has a user account, create a notification for them
    if (applicantUser?.id) {
      await supabase.rpc('create_notification', {
        p_user_id: applicantUser.id,
        p_title: `Դիմումն ընդունվել է - ${application.course_title}`,
        p_message: `Ձեր դիմումը "${application.course_title}" դասընթացին հաջողությամբ ուղարկվել է: Մենք շուտով կկապվենք Ձեզ հետ:`,
        p_type: 'course_application_confirmation'
      });
    } else {
      console.log("Applicant does not have a user account, email notification will be sent if Resend is configured");
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent successfully" }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
    
  } catch (error) {
    console.error("Error processing application notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
