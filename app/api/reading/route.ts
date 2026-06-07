import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { buildOneCardPrompt, buildThreeCardPrompt, SYSTEM } from "@/lib/tarot/prompts";
import { DrawnCard } from "@/lib/tarot/drawCards";
import { ReadingType } from "@/lib/types";
import { getAuthUser } from "@/lib/serverAuth";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  // Rule 2: Check 1 — must be logged in
  const user = await getAuthUser(request);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { cards, question, type }: { cards: DrawnCard[]; question: string; type: ReadingType } =
    await request.json();

  let prompt = "";
  if (type === "one-card") prompt = buildOneCardPrompt(cards[0], question);
  else if (type === "three-card") prompt = buildThreeCardPrompt(cards, question);
  else return new Response("Invalid reading type", { status: 400 });

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
    cancel() { stream.abort(); },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
