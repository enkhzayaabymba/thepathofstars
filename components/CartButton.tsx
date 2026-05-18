"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function CartButton() {
  const { totalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-primary)" }}
        aria-label="Open cart"
      >
        {/* Shopping bag icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>

        {/* Red badge showing number of items */}
        {totalCount > 0 && (
          <span
            className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
            style={{ backgroundColor: "#c0392b", fontSize: "10px" }}
          >
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
