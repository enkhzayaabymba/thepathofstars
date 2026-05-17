"use client";

import { useState } from "react";
import { ReadingType } from "@/lib/types";

const readingOptions: { type: ReadingType; label: string; desc: string; cards: number }[] = [
  { type: "one-card", label: "One Card", desc: "A single focused insight for your question.", cards: 1 },
  { type: "three-card", label: "Three Cards", desc: "Past, present, and future — a broader perspective.", cards: 3 },
  { type: "celtic-cross", label: "Celtic Cross", desc: "A deep 10-card spread for complex situations.", cards: 10 },
];

// 10 sample card names for the draw
const deck = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit"];

function drawCards(count: number): string[] {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, deck.length));
}

export default function ReadingPage() {
  const [selectedType, setSelectedType] = useState<ReadingType>("one-card");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [hasReading, setHasReading] = useState(false);

  const selected = readingOptions.find((r) => r.type === selectedType)!;

  function handleDraw() {
    const cards = drawCards(selected.cards);
    setDrawnCards(cards);
    setHasReading(true);
  }

  function handleReset() {
    setDrawnCards([]);
    setHasReading(false);
    setQuestion("");
  }

  return (
    <main className="max-w-190 mx-auto px-10 py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-4xl font-bold mb-3">
        Your Reading
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-base mb-10">
        Choose a spread, set your intention, and draw your cards.
      </p>

      {/* Spread selector */}
      <div className="flex flex-col gap-3 mb-8">
        {readingOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => { setSelectedType(opt.type); setHasReading(false); }}
            style={{
              backgroundColor: selectedType === opt.type ? "var(--surface)" : "var(--white)",
              border: `1px solid ${selectedType === opt.type ? "var(--text-secondary)" : "var(--border)"}`,
              borderRadius: "16px",
              padding: "16px 24px",
              textAlign: "left",
            }}
            className="transition-all"
          >
            <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">{opt.label}</p>
            <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Question input */}
      <div className="mb-8">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs mb-2 block">
          Your question or intention (optional)
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do I need to know about..."
          rows={3}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            backgroundColor: "var(--white)",
          }}
          className="w-full px-4 py-3 text-sm outline-none resize-none focus:ring-1 focus:ring-[#3A3828]"
        />
      </div>

      {/* Draw button */}
      {!hasReading ? (
        <button
          onClick={handleDraw}
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
          className="w-full py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Draw {selected.cards} Card{selected.cards > 1 ? "s" : ""}
        </button>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {drawnCards.map((card, i) => (
              <div
                key={i}
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px 28px" }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="text-3xl">✦</span>
                <p style={{ color: "var(--text-secondary)" }} className="text-xs">Card {i + 1}</p>
                <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">{card}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            className="w-full py-3 rounded-full text-sm hover:opacity-70 transition-opacity"
          >
            New Reading
          </button>
        </div>
      )}
    </main>
  );
}
