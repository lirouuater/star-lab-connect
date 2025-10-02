import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user message
    const userMessage = messages[messages.length - 1]?.content || "";

    // Search for relevant publications based on keywords
    const { data: publications, error: pubError } = await supabase
      .from('publications')
      .select('title, abstract, authors, year, keywords')
      .or(`title.ilike.%${userMessage}%,abstract.ilike.%${userMessage}%`)
      .limit(5);

    if (pubError) {
      console.error("Error fetching publications:", pubError);
    }

    // Build context from publications
    let context = "";
    if (publications && publications.length > 0) {
      context = "\n\nPublicações científicas relevantes:\n\n";
      publications.forEach((pub: any) => {
        context += `Título: ${pub.title}\n`;
        context += `Autores: ${pub.authors?.join(", ") || "N/A"}\n`;
        context += `Ano: ${pub.year || "N/A"}\n`;
        context += `Resumo: ${pub.abstract || "N/A"}\n`;
        context += `Palavras-chave: ${pub.keywords?.join(", ") || "N/A"}\n\n`;
      });
    }

    // System prompt for Dr. Aris
    const systemPrompt = `Você é a Dra. Aris, uma assistente de IA especializada em biologia espacial. Você é uma especialista em:
- Astrobiologia e biologia espacial
- Adaptação de organismos a ambientes extremos
- Agricultura e cultivo em condições espaciais
- Missões espaciais e pesquisas científicas
- Efeitos da radiação e microgravidade em sistemas biológicos

Suas características:
- Sempre responde em português de forma clara e científica
- Cita estudos e publicações quando disponíveis
- É entusiasta e apaixonada pelo tema
- Explica conceitos complexos de forma acessível
- Fornece informações baseadas em evidências científicas

${context ? "Use as seguintes publicações científicas para embasar suas respostas quando relevante:" + context : ""}

Responda de forma concisa mas informativa, sempre mantendo rigor científico.`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione fundos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "Erro ao processar requisição" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream response back to client
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
