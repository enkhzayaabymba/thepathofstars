"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import TarotCard from "@/components/TarotCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").limit(3).then(({ data }) => {
      setFeaturedProducts((data as Product[]) ?? []);
    });
  }, []);

  const features = [
    { icon: "✦", title: t.feat_daily_title, desc: t.feat_daily_desc },
    { icon: "◈", title: t.feat_deep_title, desc: t.feat_deep_desc },
    { icon: "◉", title: t.feat_curated_title, desc: t.feat_curated_desc },
  ];

  return (
    <main>
      <HeroSection />

      {/* How it works */}
      <section
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        className="py-20"
      >
        <div className="max-w-300 mx-auto px-4 md:px-10">
          <h2 style={{ color: "var(--text-primary)" }} className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t.how_it_works}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-3 text-center">
                <span className="text-3xl">{f.icon}</span>
                <h3 style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">{f.title}</h3>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-300 mx-auto px-4 md:px-10 py-14 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 style={{ color: "var(--text-primary)" }} className="text-2xl md:text-3xl font-bold">
            {t.featured_products}
          </h2>
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
