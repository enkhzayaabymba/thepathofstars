import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-300 mx-auto px-4 md:px-10 py-14 md:py-20 flex flex-col items-center text-center">
      <span
        style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        className="text-xs px-3 py-1 rounded-full mb-6"
      >
        Your cosmic guide awaits
      </span>

      <h1
        style={{ color: "var(--text-primary)", lineHeight: 1.1 }}
        className="text-3xl md:text-5xl font-bold max-w-190 mb-6"
      >
        Discover the wisdom hidden in the stars
      </h1>

      <p
        style={{ color: "var(--text-secondary)" }}
        className="text-base md:text-lg max-w-140 mb-10 leading-relaxed"
      >
        Explore tarot readings, shop curated decks, and uncover insights that
        guide your journey — one card at a time.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          href="/reading"
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
          className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity text-center"
        >
          Start Your Reading
        </Link>
        <Link
          href="/shop"
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-70 transition-opacity text-center"
        >
          Go to Shop
        </Link>
      </div>
    </section>
  );
}
