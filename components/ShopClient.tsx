"use client";

import { useState } from "react";
import TarotCard from "@/components/TarotCard";
import { Product } from "@/lib/types";

const categories = ["All", "Deck", "Oracle", "Accessory"];

type Props = {
  products: Product[];
};

export default function ShopClient({ products }: Props) {
  const [selected, setSelected] = useState("All");

  const filtered =
    selected === "All"
      ? products
      : products.filter((p) => p.category === selected);

  return (
    <div>
      {/* Category filters */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            style={{
              border: "1px solid var(--border)",
              color: selected === cat ? "var(--white)" : "var(--text-secondary)",
              backgroundColor: selected === cat ? "var(--text-primary)" : "transparent",
              borderRadius: "100px",
            }}
            className="text-sm px-5 py-2 transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <TarotCard
              key={product.id}
              name={product.name}
              description={product.description}
              imageUrl={product.image_url || undefined}
              price={product.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
