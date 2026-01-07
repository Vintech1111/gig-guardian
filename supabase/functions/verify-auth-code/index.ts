import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  token: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { token, code }: VerifyCodeRequest = await req.json();

    console.log("Verifying auth code for token:", token);

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

    // Check if code matches
    if (caseData.authorization_code !== code.toUpperCase()) {
      console.log("Invalid code provided");
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Invalid authorization code",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update case status to service_in_progress
    const { error: updateError } = await supabase
      .from("cases")
      .update({
        code_verified: true,
        status: "service_in_progress",
      })
      .eq("token", token);

    if (updateError) {
      console.error("Error updating case:", updateError);
      throw new Error("Failed to update case");
    }

    console.log("Code verified successfully, status updated to service_in_progress");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Code verified successfully. Your service is now in progress!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-auth-code function:", error);
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
