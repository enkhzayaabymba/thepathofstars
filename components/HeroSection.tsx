"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="max-w-300 mx-auto px-4 md:px-10 py-14 md:py-20 flex flex-col items-center text-center">
      <span
        style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        className="text-xs px-3 py-1 rounded-full mb-6"
      >
        {t.hero_badge}
      </span>

      <h1
        style={{ color: "var(--text-primary)", lineHeight: 1.1 }}
        className="text-3xl md:text-5xl font-bold max-w-190 mb-6"
      >
        {t.hero_title}
      </h1>

      <p
        style={{ color: "var(--text-secondary)" }}
        className="text-base md:text-lg max-w-140 mb-10 leading-relaxed"
      >
        {t.hero_desc}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          href="/reading"
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
          className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity text-center"
        >
          {t.hero_reading}
        </Link>
        <Link
          href="/shop"
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-70 transition-opacity text-center"
        >
          {t.hero_shop}
        </Link>
      </div>
    </section>
  );
}
