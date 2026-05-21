"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import { placeOrder } from "@/lib/orderService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setMessage(null);

    // Get the current logged-in user
    const { data } = await supabase.auth.getSession();
    const userEmail = data.session?.user?.email;

    if (!userEmail) {
      setMessage("Please log in to place an order.");
      setLoading(false);
      return;
    }

    const error = await placeOrder(userEmail, items);

    if (error) {
      setMessage(error);
    } else {
      clearCart();
      setMessage("Order placed! We will contact you soon.");
    }

    setLoading(false);
  }

  return (
    <>
      {/* Dark overlay behind the drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={onClose}
        />
      )}

      {/* The drawer itself slides in from the right */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{
          width: "380px",
          backgroundColor: "var(--bg-main)",
          borderLeft: "1px solid var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            style={{ color: "var(--text-secondary)" }}
            className="text-xl hover:opacity-60 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p
              style={{ color: "var(--text-secondary)" }}
              className="text-sm text-center mt-10"
            >
              {message ?? "Your cart is empty."}
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 items-start"
                style={{
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "16px",
                }}
              >
                {/* Product image */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "8px",
                    width: "64px",
                    height: "64px",
                    flexShrink: 0,
                  }}
                  className="overflow-hidden flex items-center justify-center"
                >
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">✦</span>
                  )}
                </div>

                {/* Name, qty, price */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{ color: "var(--text-primary)" }}
                    className="text-sm font-semibold truncate"
                  >
                    {item.product.name}
                  </p>
                  <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">
                    Qty: {item.quantity}
                  </p>
                  <p style={{ color: "var(--text-primary)" }} className="text-sm mt-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs hover:opacity-60 transition-opacity mt-1"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with total + checkout */}
        {items.length > 0 && (
          <div
            className="px-6 py-5 flex flex-col gap-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Error or info message */}
            {message && (
              <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center">
                {message}
              </p>
            )}

            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }} className="text-sm">
                Total
              </span>
              <span style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--bg-main)",
                borderRadius: "100px",
                opacity: loading ? 0.6 : 1,
              }}
              className="w-full py-3 text-sm font-semibold transition-opacity"
            >
              {loading ? "Placing order..." : "Checkout"}
            </button>

            <button
              onClick={clearCart}
              style={{ color: "var(--text-secondary)" }}
              className="text-xs text-center hover:opacity-60 transition-opacity"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
