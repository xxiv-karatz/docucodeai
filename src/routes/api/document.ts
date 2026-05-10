import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { DOCUMENTATION_SYSTEM_PROMPT, buildDocumentationUserPrompt } from "@/lib/prompts";
import { getPromptPreset } from "@/lib/prompt-library";
import { estimateCost } from "@/lib/pricing";

const BodySchema = z.object({
  code: z.string().min(1).max(20_000),
  language: z.string().min(1).max(40),
  model: z.string().min(1).max(120).optional(),
  promptPresetId: z.string().min(1).max(40).optional(),
});

const DocSchema = z.object({
  commented_code: z.string(),
  docstring: z.string(),
  explanation: z.string(),
  test_snippet: z.string(),
  readme_snippet: z.string(),
  complexity_score: z.string(),
  edge_cases: z.array(z.string()),
});

function safeParseJson(text: string) {
  // Strip markdown fences if present
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const Route = createFileRoute("/api/document")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch (err) {
          return new Response(
            JSON.stringify({ error: "Invalid request body" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Missing LOVABLE_API_KEY" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const modelId = parsed.model || "google/gemini-3-flash-preview";
        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway(modelId);

        try {
          const result = await generateText({
            model,
            system: DOCUMENTATION_SYSTEM_PROMPT,
            prompt: buildDocumentationUserPrompt(parsed.code, parsed.language),
          });

          const json = safeParseJson(result.text);
          const usage = result.usage ?? { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
          const inputTokens = (usage as any).inputTokens ?? (usage as any).promptTokens ?? 0;
          const outputTokens = (usage as any).outputTokens ?? (usage as any).completionTokens ?? 0;
          const cost = estimateCost(inputTokens, outputTokens);

          if (!json) {
            return Response.json({
              ok: false,
              raw: result.text,
              error: "Could not parse JSON output",
              usage: { inputTokens, outputTokens, cost },
              model: modelId,
            }, { status: 200 });
          }

          const validated = DocSchema.safeParse(json);
          if (!validated.success) {
            return Response.json({
              ok: false,
              raw: result.text,
              partial: json,
              error: "JSON did not match schema",
              usage: { inputTokens, outputTokens, cost },
              model: modelId,
            }, { status: 200 });
          }

          return Response.json({
            ok: true,
            doc: validated.data,
            usage: { inputTokens, outputTokens, cost },
            model: modelId,
          });
        } catch (err: any) {
          const status = err?.statusCode || err?.status;
          if (status === 429) {
            return Response.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429 });
          }
          if (status === 402) {
            return Response.json({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }, { status: 402 });
          }
          console.error("document error:", err);
          return Response.json({ error: err?.message || "AI request failed" }, { status: 500 });
        }
      },
    },
  },
});
