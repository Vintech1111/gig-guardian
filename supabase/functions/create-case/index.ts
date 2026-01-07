import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCaseRequest {
  email: string;
  name: string;
  phone?: string;
  platform: string;
  service: string;
  tier: string;
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name, phone, platform, service, tier }: CreateCaseRequest = await req.json();

    console.log("Creating case for:", { email, name, platform, service, tier });

    // Generate unique token
    const token = generateToken();

    // Create case in database
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .insert({
        token,
        email,
        name,
        phone,
        platform,
        service,
        tier,
        status: "pending_payment",
      })
      .select()
      .single();

    if (caseError) {
      console.error("Error creating case:", caseError);
      throw new Error("Failed to create case");
    }

    console.log("Case created:", caseData.id);

    // Get the base URL from the request origin or use a default
    const origin = req.headers.get("origin") || "https://your-app.lovable.app";
    const dashboardUrl = `${origin}/case/${token}`;

    // Send email with dashboard link
    const emailResponse = await resend.emails.send({
      from: "Gig Driver Support <onboarding@resend.dev>",
      to: [email],
      subject: "Your Case Dashboard - Gig Driver Support",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Gig Driver Support</h1>
              <p>Your Service Request Has Been Received</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for choosing Gig Driver Support. Your service request has been received and a case has been created.</p>
              
              <div class="details">
                <h3>Case Details:</h3>
                <p><strong>Platform:</strong> ${platform}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Package:</strong> ${tier}</p>
              </div>
              
              <p><strong>Next Step:</strong> Please access your case dashboard to upload your payment proof.</p>
              
              <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
              
              <p>Or copy this link: ${dashboardUrl}</p>
              
              <p>Once payment is verified, we will begin processing your request immediately.</p>
              
              <div class="footer">
                <p>If you have any questions, contact us on WhatsApp or Email.</p>
                <p>© 2024 Gig Driver Support. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        caseId: caseData.id,
        token: token,
        message: "Case created and email sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-case function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
