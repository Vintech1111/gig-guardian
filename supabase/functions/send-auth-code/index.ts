import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAuthCodeRequest {
  token: string;
  adminWhatsappNumber?: string;
}

function generateAuthCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { token, adminWhatsappNumber }: SendAuthCodeRequest = await req.json();

    console.log("Processing payment upload for token:", token);

    // Get case data
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (caseError || !caseData) {
      console.error("Case not found:", caseError);
      throw new Error("Case not found");
    }

    // Generate authorization code
    const authCode = generateAuthCode();

    // Update case with auth code and status
    const { error: updateError } = await supabase
      .from("cases")
      .update({
        authorization_code: authCode,
        status: "payment_uploaded",
      })
      .eq("token", token);

    if (updateError) {
      console.error("Error updating case:", updateError);
      throw new Error("Failed to update case");
    }

    console.log("Auth code generated:", authCode);

    // Send authorization code email to user
    const emailResponse = await resend.emails.send({
      from: "Gig Driver Support <onboarding@resend.dev>",
      to: [caseData.email],
      subject: "Your Authorization Code - Gig Driver Support",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Authorization Code</h1>
              <p>Your Payment Has Been Received</p>
            </div>
            <div class="content">
              <h2>Hello ${caseData.name}!</h2>
              <p>We have received your payment proof. Please use the authorization code below to verify your payment on the dashboard.</p>
              
              <div class="code-box">${authCode}</div>
              
              <p><strong>Instructions:</strong></p>
              <ol>
                <li>Go to your case dashboard</li>
                <li>Enter the authorization code above</li>
                <li>Click "Verify Code" to confirm your payment</li>
              </ol>
              
              <p>Once verified, your service will begin processing immediately.</p>
              
              <div class="footer">
                <p>This code is valid for 24 hours. Do not share this code with anyone.</p>
                <p>© 2024 Gig Driver Support. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Auth code email sent:", emailResponse);

    // Return WhatsApp link for admin notification
    const adminNumber = adminWhatsappNumber || caseData.admin_whatsapp_number || "+13093198991";
    const whatsappMessage = encodeURIComponent(
      `🔔 New Payment Uploaded!\n\n` +
      `Case: ${caseData.id}\n` +
      `Name: ${caseData.name}\n` +
      `Email: ${caseData.email}\n` +
      `Platform: ${caseData.platform}\n` +
      `Service: ${caseData.service}\n` +
      `Tier: ${caseData.tier}\n\n` +
      `Payment proof has been uploaded. Please review.`
    );
    const whatsappUrl = `https://wa.me/${adminNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Authorization code sent successfully",
        whatsappUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-auth-code function:", error);
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
