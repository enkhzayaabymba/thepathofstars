"use client";

import { useState } from "react";
import TarotCard from "@/components/TarotCard";
import ProductModal from "@/components/ProductModal";
import { Product, Category } from "@/lib/types";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ShopClient({ products, categories }: Props) {
  const [selected, setSelected] = useState("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { t } = useLanguage();

  const allLabel = t.nav_shop === "Shop" ? "All" : "Бүгд";
  const allCategories = [{ value: "all", label: allLabel }, ...categories.map((c) => ({ value: c.name, label: c.name }))];

  const filtered = selected === "all"
    ? products
    : products.filter((p) => p.category === selected);

  return (
    <div>
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl md:text-4xl font-bold mb-3">
          {t.shop_title}
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-base">{t.shop_desc}</p>
      </div>

      {/* Category filters */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {allCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelected(cat.value)}
            style={{
              border: "1px solid var(--border)",
              color: selected === cat.value ? "var(--white)" : "var(--text-secondary)",
              backgroundColor: selected === cat.value ? "var(--text-primary)" : "transparent",
              borderRadius: "100px",
            }}
            className="text-sm px-5 py-2 transition-all"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">{t.shop_empty}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
