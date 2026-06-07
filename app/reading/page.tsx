"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReadingType } from "@/lib/types";
import { drawCards, DrawnCard } from "@/lib/tarot/drawCards";
import ReadingResult from "@/components/ReadingResult";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function ReadingPage() {
  const [type, setType] = useState<ReadingType>("one-card");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGuestReading, setIsGuestReading] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  const OPTIONS = [
    { type: "one-card" as ReadingType, label: t.one_card, desc: t.one_card_desc, cards: 1 },
    { type: "three-card" as ReadingType, label: t.three_card, desc: t.three_card_desc, cards: 3 },
  ];

  const selected = OPTIONS.find((o) => o.type === type)!;

  async function handleDraw() {
    const { data: { session } } = await supabase.auth.getSession();
    const isLoggedIn = !!session;

    if (!isLoggedIn) {
      const freeUsed = localStorage.getItem("free_reading_used") === "true";
      if (freeUsed) {
        router.push("/login");
        return;
      }
    }

    setLoading(true);
    setReading("");
    const drawn = drawCards(selected.cards);
    setCards(drawn);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
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
      if (!isLoggedIn) {
        localStorage.setItem("free_reading_used", "true");
        setIsGuestReading(true);
      }
    } catch {
      setReading("Уншлага гарахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCards(null);
    setReading("");
    setQuestion("");
    setLoading(false);
    setIsGuestReading(false);
  }

  if (cards) {
    return (
      <ReadingResult
        cards={cards}
        readingType={type}
        reading={reading}
        loading={loading}
        onReset={handleReset}
        isGuestReading={isGuestReading}
      />
    );
  }

  const drawLabel = selected.cards === 1
    ? t.draw_card.replace("{n}", "1")
    : t.draw_cards.replace("{n}", String(selected.cards));

  return (
    <main className="max-w-190 mx-auto px-4 md:px-10 py-12 md:py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-2xl md:text-4xl font-bold mb-3">
        {t.reading_title}
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-base mb-10">
        {t.reading_sub}
      </p>

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
            <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">{opt.label}</p>
            <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs mb-2 block">
          {t.question_label}
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.question_placeholder}
          rows={3}
          style={{ border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", backgroundColor: "var(--white)" }}
          className="w-full px-4 py-3 text-sm outline-none resize-none focus:ring-1 focus:ring-[#3A3828]"
        />
      </div>

      <button
        onClick={handleDraw}
        style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
        className="w-full py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
      >
        {drawLabel}
      </button>
    </main>
  );
}
