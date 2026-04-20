import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Max-Age": "600", // cache do preflight por 10 minutos
};

const BodySchema = z.object({
  nome: z.string().min(1).max(255),
  idade: z.number().int().min(1).max(120),
  email: z.string().email().max(255),
  telefone: z.string().min(1).max(20),
  valor: z.number().min(0),
  isMembro: z.boolean(),
});

Deno.serve(async (req) => {
  // ✅ Tratamento correto do preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { nome, idade, email, telefone, valor, isMembro } = parsed.data;

    const message = `🔔 *Nova Inscrição no Retiro!*\n\n` +
      `👤 *Nome:* ${nome}\n` +
      `🎂 *Idade:* ${idade} anos\n` +
      `📧 *E-mail:* ${email}\n` +
      `📱 *Telefone:* ${telefone}\n` +
      `💰 *Valor:* R$ ${valor.toFixed(2).replace(".", ",")}\n` +
      `⛪ *Membro:* ${isMembro ? "Sim" : "Não (visitante)"}\n\n` +
      `✅ Acesse o painel admin para mais detalhes.`;

    const sisters = [
      { name: "Irmã Ivanildes", phone: "61984624381" },
      { name: "Irmã Stephanie", phone: "61998762089" },
      { name: "Irmã Ladyvania", phone: "83993832746" },
    ];

    const whatsappLinks = sisters.map((s) => ({
      name: s.name,
      link: `https://wa.me/${s.phone}?text=${encodeURIComponent(message)}`,
    }));

    console.log("Nova inscrição notificada:", whatsappLinks);

    return new Response(
      JSON.stringify({ success: true, whatsappLinks }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});