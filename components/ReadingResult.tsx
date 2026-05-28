"use client";

import Image from "next/image";
import { DrawnCard } from "@/lib/tarot/drawCards";
import { ReadingType } from "@/lib/types";

const THREE_LABELS = ["Өнгөрсөн", "Одоо", "Ирээдүй"];
const CELTIC_LABELS = [
  "Одоогийн байдал", "Саад / сорилт", "Далд шалтгаан", "Өнгөрсөн нөлөө",
  "Дээд боломж", "Ойрын ирээдүй", "Өөрийн хандлага", "Гадаад нөлөө",
  "Найдвар / айдас", "Эцсийн үр дүн",
];

type Props = {
  cards: DrawnCard[];
  readingType: ReadingType;
  reading: string;
  loading: boolean;
  onReset: () => void;
};

function getLabel(type: ReadingType, i: number) {
  if (type === "three-card") return THREE_LABELS[i];
  if (type === "celtic-cross") return CELTIC_LABELS[i];
  return undefined;
}

function CardChip({ card, label }: { card: DrawnCard; label?: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      className="flex flex-col"
    >
      <div className="relative w-full" style={{ paddingBottom: "150%" }}>
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
          style={{ transform: card.reversed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
          unoptimized
        />
      </div>
      <div style={{ padding: "10px 12px" }}>
        {label && (
          <p style={{ color: "var(--text-secondary)" }} className="text-xs mb-0.5">{label}</p>
        )}
        <p style={{ color: "var(--text-primary)" }} className="font-semibold text-xs leading-tight">{card.name}</p>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">
          {card.reversed ? "🔄 Урвуу" : "⬆ Дээшээ"} · {card.element}
        </p>
      </div>
    </div>
  );
}

export default function ReadingResult({ cards, readingType, reading, loading, onReset }: Props) {
  const isCeltic = readingType === "celtic-cross";
  const isThree = readingType === "three-card";

  return (
    <main className="max-w-190 mx-auto px-10 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold">Таны уншлага</h1>
        <button
          onClick={onReset}
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          className="px-5 py-2 rounded-full text-xs hover:opacity-70 transition-opacity"
        >
          Шинэ уншлага
        </button>
      </div>

      {/* Cards */}
      <div
        className={
          isCeltic
            ? "grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10"
            : isThree
            ? "grid grid-cols-3 gap-4 mb-10"
            : "flex justify-center mb-10"
        }
      >
        {cards.map((card, i) => (
          <div key={i} className={!isCeltic && !isThree ? "w-48" : ""}>
            <CardChip card={card} label={getLabel(readingType, i)} />
          </div>
        ))}
      </div>

      {/* Reading text */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px",
          minHeight: "120px",
        }}
      >
        {loading && !reading ? (
          <div className="flex items-center gap-3">
            <span className="text-xl animate-pulse">✦</span>
            <p style={{ color: "var(--text-secondary)" }} className="text-sm">Уншлага бэлтгэж байна...</p>
          </div>
        ) : (
          <p style={{ color: "var(--text-primary)", lineHeight: "1.9", whiteSpace: "pre-wrap" }} className="text-sm">
            {reading}
            {loading && <span className="animate-pulse ml-0.5">▌</span>}
          </p>
        )}
      </div>
    </main>
  );
}
