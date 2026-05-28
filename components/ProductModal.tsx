"use client";

import { useState } from "react";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
};

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
  const allImages = product.images?.length ? product.images : product.image_url ? [product.image_url] : [];
  const [activeImg, setActiveImg] = useState(allImages[0] ?? "");
  const [qty, setQty] = useState(1);

  function handleAdd() { onAddToCart(qty); onClose(); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="relative w-full max-w-2xl flex flex-col sm:flex-row gap-0 overflow-hidden"
        style={{ backgroundColor: "var(--bg-main)", borderRadius: "20px", border: "1.5px solid var(--border)", maxHeight: "90vh", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} style={{ color: "var(--text-secondary)", position: "absolute", top: "16px", right: "16px", zIndex: 10 }} className="text-xl hover:opacity-60 transition-opacity">✕</button>

        {/* Image + thumbnails */}
        <div className="sm:w-1/2 flex flex-col" style={{ backgroundColor: "var(--surface)", flexShrink: 0, borderRight: "1.5px solid var(--border)" }}>
          <div className="flex-1 h-60 sm:h-auto flex items-center justify-center overflow-hidden"
            style={{ borderBottom: allImages.length > 1 ? "1px solid var(--border)" : undefined }}>
            {activeImg ? <img src={activeImg} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-6xl">✦</span>}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {allImages.map((img, i) => (
                <button key={i} type="button" onClick={() => setActiveImg(img)}
                  style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, border: activeImg === img ? "2px solid var(--text-primary)" : "1px solid var(--border)", opacity: activeImg === img ? 1 : 0.55 }}
                  className="transition-all hover:opacity-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 p-4 sm:p-8 overflow-y-auto">
          <span style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)", borderRadius: "100px", border: "1px solid var(--border)" }} className="text-xs px-3 py-1 w-fit">{product.category}</span>
          <h2 style={{ color: "var(--text-primary)" }} className="text-xl sm:text-2xl font-bold">{product.name}</h2>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm leading-relaxed">{product.description}</p>
          <p style={{ color: "var(--text-primary)" }} className="text-2xl font-bold mt-auto">${product.price.toFixed(2)}</p>

          <div className="flex items-center gap-4">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "50%", width: "36px", height: "36px" }} className="flex items-center justify-center text-lg hover:opacity-60 transition-opacity shrink-0">−</button>
            <span style={{ color: "var(--text-primary)", minWidth: "24px" }} className="text-lg font-semibold text-center">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} style={{ border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "50%", width: "36px", height: "36px" }} className="flex items-center justify-center text-lg hover:opacity-60 transition-opacity shrink-0">+</button>
          </div>
          <button onClick={handleAdd} style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }} className="w-full py-3 text-sm font-semibold hover:opacity-80 transition-opacity">
            Add {qty} to Cart — ${(product.price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
