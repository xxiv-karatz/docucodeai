import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { COMPARE_SYSTEM_PROMPT } from "@/lib/prompts";
import { estimateCost } from "@/lib/pricing";

const BodySchema = z.object({
  original: z.string().min(1).max(20_000),
  documented: z.string().min(1).max(20_000),
  language: z.string().min(1).max(40),
});

function safeParseJson(text: string) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

export const Route = createFileRoute("/api/compare")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let parsed;
        try { parsed = BodySchema.parse(await request.json()); }
        catch { return Response.json({ error: "Invalid body" }, { status: 400 }); }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return Response.json({ error: "Missing LOVABLE_API_KEY" }, { status: 500 });

        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = await generateText({
            model,
            system: COMPARE_SYSTEM_PROMPT,
            prompt: `Language: ${parsed.language}\n\nORIGINAL:\n\`\`\`\n${parsed.original}\n\`\`\`\n\nDOCUMENTED:\n\`\`\`\n${parsed.documented}\n\`\`\``,
          });
          const json = safeParseJson(result.text);
          const u = result.usage ?? {};
          const inputTokens = (u as any).inputTokens ?? (u as any).promptTokens ?? 0;
          const outputTokens = (u as any).outputTokens ?? (u as any).completionTokens ?? 0;
          const cost = estimateCost(inputTokens, outputTokens);
          if (!json) return Response.json({ ok: false, raw: result.text, usage: { inputTokens, outputTokens, cost } });
          return Response.json({ ok: true, comparison: json, usage: { inputTokens, outputTokens, cost } });
        } catch (err: any) {
          const status = err?.statusCode || err?.status;
          if (status === 429) return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
          if (status === 402) return Response.json({ error: "AI credits exhausted." }, { status: 402 });
          console.error("compare error:", err);
          return Response.json({ error: err?.message || "AI request failed" }, { status: 500 });
        }
      },
    },
  },
});
