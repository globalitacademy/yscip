
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    
    // For now, let's log the notification since we don't have actual email implementation
    console.log("Would send email notification to:", adminEmails);
    console.log("Also send notification to admin email:", "gitedu@bk.ru");
    console.log("Email subject: New course application for", application.course_title);
    
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
    console.log("Application details:", formatDetails);
    
    // TODO: In a production environment, replace this with actual email sending code
    // For example, using an email service like SendGrid, Mailgun, or AWS SES
    
    // Simulate sending email to gitedu@bk.ru
    console.log("Simulating email send to gitedu@bk.ru");
    console.log("Email would contain:");
    console.log(`Subject: New application for ${application.course_title}`);
    console.log(`Body: 
      A new application has been submitted for "${application.course_title}"
      
      ${formatDetails}
      
      You can log in to the admin dashboard to manage this application.
    `);
    
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
      .single();
      
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
      console.log("Applicant does not have a user account, would send email to:", application.email);
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
