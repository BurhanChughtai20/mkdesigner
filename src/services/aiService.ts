import type { FormOutput } from "@/schema/formSchema";
import type { AIOutput } from "@/types";

// FIX: data: any → FormOutput, return type → AIOutput, b: any → typed inline
export async function generateCampaign(data: FormOutput): Promise<AIOutput> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: JSON.stringify(data) }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.json() as { error?: { message?: string } };
    throw new Error(errBody?.error?.message ?? `HTTP ${res.status}`);
  }

  const raw = await res.json() as {
    content: { type: string; text: string }[];
  };

  const text = raw.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(text) as AIOutput;
}