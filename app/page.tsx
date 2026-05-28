import HeroSection from "@/components/HeroSection";
import TarotCard from "@/components/TarotCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

const features = [
  { icon: "✦", title: "Daily Card", desc: "Pull a card each morning to set your intention for the day." },
  { icon: "◈", title: "Deep Readings", desc: "Three-card and Celtic Cross spreads for complex questions." },
  { icon: "◉", title: "Curated Decks", desc: "Shop beautifully illustrated tarot and oracle decks." },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").limit(3);
  return (data as Product[]) ?? [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
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

          <div className="flex justify-center mt-12">
            <Link
              href="/reading"
              style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
              className="px-8 py-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Start a Reading →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cards */}
      <section className="max-w-300 mx-auto px-10 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold">
            Featured Products
          </h2>
          <Link
            href="/shop"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            className="text-sm px-5 py-2 rounded-full hover:opacity-70 transition-opacity"
          >
            Go to Shop →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href="/shop">
              <TarotCard
                name={product.name}
                description={product.description}
                imageUrl={product.image_url}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
