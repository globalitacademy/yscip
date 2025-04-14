
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  name?: string;
  verificationUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, verificationUrl }: EmailRequest = await req.json();

    if (!email || !verificationUrl) {
      return new Response(
        JSON.stringify({ error: "Email and verification URL are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending verification email to: ${email} with URL: ${verificationUrl}`);
    
    const { data, error } = await resend.emails.send({
      from: "Verification <onboarding@resend.dev>",
      to: [email],
      subject: "Հաստատեք Ձեր էլ․ փոստը",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Հաստատեք Ձեր էլ․ փոստը</h2>
          <p>Հարգելի ${name || 'օգտատեր'},</p>
          <p>Շնորհակալություն գրանցվելու համար: Խնդրում ենք սեղմել ստորև բերված կոճակը՝ Ձեր էլ․ փոստը հաստատելու համար:</p>
          
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Հաստատել էլ․ փոստը
            </a>
          </div>
          
          <p>Կամ կարող եք օգտագործել հետևյալ հղումը.</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Եթե Դուք չեք կատարել այս հարցումը, խնդրում ենք անտեսել այս նամակը:
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`Error sending email: ${JSON.stringify(error)}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`Email sent successfully: ${JSON.stringify(data)}`);
    
    return new Response(JSON.stringify({ success: true, message: "Verification email sent" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error in send-verification-email function: ${error.message}`);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
