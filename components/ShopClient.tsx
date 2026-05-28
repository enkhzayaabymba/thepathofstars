"use client";

import { useState } from "react";
import TarotCard from "@/components/TarotCard";
import ProductModal from "@/components/ProductModal";
import { Product, Category } from "@/lib/types";
import { useCart } from "@/lib/CartContext";

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ShopClient({ products, categories }: Props) {
  const [selected, setSelected] = useState("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  const allCategories = ["All", ...categories.map((c) => c.name)];

  const filtered = selected === "All"
    ? products
    : products.filter((p) => p.category === selected);

  return (
    <div>
      {/* Category filters */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {allCategories.map((cat) => (
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
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((product) => (
            <TarotCard
              key={product.id}
              name={product.name}
              description={product.description}
              imageUrl={product.image_url || undefined}
              price={product.price}
              onClick={() => setActiveProduct(product)}
              onAddToCart={(quantity) => addItem(product, quantity)}
            />
          ))}
        </div>
      )}

      {/* Product detail modal */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(quantity) => {
            addItem(activeProduct, quantity);
            setActiveProduct(null);
          }}
        />
      )}
    </div>
  );
}
