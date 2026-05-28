"use client";

import { useState } from "react";
import { ReadingType } from "@/lib/types";
import { drawCards, DrawnCard } from "@/lib/tarot/drawCards";
import ReadingResult from "@/components/ReadingResult";

const OPTIONS = [
  {
    type: "one-card" as ReadingType,
    label: "Нэг карт",
    desc: "Нэг асуулт, нэг хариулт — товч, гүн уншлага.",
    cards: 1,
  },
  {
    type: "three-card" as ReadingType,
    label: "Гурван карт",
    desc: "Өнгөрсөн · Одоо · Ирээдүй — цогц харагдац.",
    cards: 3,
  },
  {
    type: "celtic-cross" as ReadingType,
    label: "Celtic Cross",
    desc: "10 картын гүнзгий уншлага — нарийн нөхцөл байдалд.",
    cards: 10,
  },
];

export default function ReadingPage() {
  const [type, setType] = useState<ReadingType>("one-card");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = OPTIONS.find((o) => o.type === type)!;

  async function handleDraw() {
    setLoading(true);
    setReading("");
    const drawn = drawCards(selected.cards);
    setCards(drawn);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: drawn, question, type }),
      });
      if (!res.ok || !res.body) throw new Error("API алдаа");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setReading(text);
      }
    } catch {
      setReading("Уншлага гарахад алдаа гарлаа. ANTHROPIC_API_KEY-г .env.local-д нэмсэн эсэхийг шалгаарай.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCards(null);
    setReading("");
    setQuestion("");
    setLoading(false);
  }

  if (cards) {
    return (
      <ReadingResult
        cards={cards}
        readingType={type}
        reading={reading}
        loading={loading}
        onReset={handleReset}
      />
    );
  }

  return (
    <main className="max-w-190 mx-auto px-10 py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-4xl font-bold mb-3">
        Таны уншлага
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-base mb-10">
        Тархалт сонгоод, зорилгоо тавиад, картаа татна уу.
      </p>

      {/* Spread options */}
      <div className="flex flex-col gap-3 mb-8">
        {OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setType(opt.type)}
            style={{
              backgroundColor: type === opt.type ? "var(--surface)" : "var(--white)",
              border: `1px solid ${type === opt.type ? "var(--text-secondary)" : "var(--border)"}`,
              borderRadius: "16px",
              padding: "16px 24px",
              textAlign: "left",
            }}
            className="transition-all"
          >
            <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">
              {opt.label}
            </p>
            <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">
              {opt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="mb-8">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs mb-2 block">
          Таны асуулт эсвэл зорилго (заавал биш)
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Юу мэдэх хэрэгтэй вэ..."
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

      <button
        onClick={handleDraw}
        style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
        className="w-full py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
      >
        {selected.cards} карт татах — уншлага эхлэх
      </button>
    </main>
  );
}
