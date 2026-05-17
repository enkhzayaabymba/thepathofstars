import HeroSection from "@/components/HeroSection";
import TarotCard from "@/components/TarotCard";
import Link from "next/link";

const features = [
  { icon: "✦", title: "Daily Card", desc: "Pull a card each morning to set your intention for the day." },
  { icon: "◈", title: "Deep Readings", desc: "Three-card and Celtic Cross spreads for complex questions." },
  { icon: "◉", title: "Curated Decks", desc: "Shop beautifully illustrated tarot and oracle decks." },
];

const previewCards = [
  { name: "The Fool", description: "New beginnings, spontaneity, and a free spirit ready to leap into the unknown." },
  { name: "The Star", description: "Hope, renewal, and calm inspiration after a period of struggle." },
  { name: "The Moon", description: "Intuition, dreams, and the unconscious mind revealing hidden truths." },
];

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* How it works */}
      <section
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        className="py-20"
      >
        <div className="max-w-300 mx-auto px-10">
          <h2 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-3 text-center">
                <span className="text-3xl">{f.icon}</span>
                <h3 style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cards */}
      <section className="max-w-300 mx-auto px-10 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold">
            Featured Cards
          </h2>
          <Link
            href="/reading"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            className="text-sm px-5 py-2 rounded-full hover:opacity-70 transition-opacity"
          >
            Start a Reading →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewCards.map((card) => (
            <TarotCard key={card.name} name={card.name} description={card.description} />
          ))}
        </div>
      </section>
    </main>
  );
}
