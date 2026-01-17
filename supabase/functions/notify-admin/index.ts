import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyAdminRequest {
  fullName: string;
  email: string;
  accountDetails: string;
  location: string;
  platform: string;
  service: string;
  price: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-admin function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotifyAdminRequest = await req.json();
    console.log("Received request data:", data);

    const { fullName, email, accountDetails, location, platform, service, price } = data;

    // Admin email
    const adminEmail = "acc.wisezero@gmail.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Gig Driver Support <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🚀 New Request: ${service} for ${platform}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; }
              .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
              .content { padding: 30px; }
              .info-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
              .info-row:last-child { border-bottom: none; }
              .label { color: #64748b; font-size: 14px; }
              .value { color: #1e293b; font-weight: 600; font-size: 14px; }
              .price { font-size: 28px; color: #6366f1; font-weight: bold; text-align: center; padding: 20px; }
              .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 New Service Request</h1>
              </div>
              <div class="content">
                <div class="price">$${price}</div>
                
                <div class="info-card">
                  <h3 style="margin-top: 0; color: #1e293b;">Customer Information</h3>
                  <div class="info-row">
                    <span class="label">Full Name</span>
                    <span class="value">${fullName}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Location</span>
                    <span class="value">${location}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h3 style="margin-top: 0; color: #1e293b;">Service Details</h3>
                  <div class="info-row">
                    <span class="label">Platform</span>
                    <span class="value">${platform}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Service</span>
                    <span class="value">${service}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h3 style="margin-top: 0; color: #1e293b;">Account Details</h3>
                  <p style="color: #475569; margin: 0; white-space: pre-wrap;">${accountDetails}</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated notification from Gig Driver Support</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin function:", error);
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
