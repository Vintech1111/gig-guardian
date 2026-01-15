import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
        authCode: authCode,
        message: "Authorization code generated successfully",
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