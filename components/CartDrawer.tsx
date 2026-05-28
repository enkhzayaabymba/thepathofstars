"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import { placeOrder } from "@/lib/orderService";
import CheckoutForm from "@/components/CheckoutForm";
import BankTransferInfo from "@/components/BankTransferInfo";
import { useLanguage } from "@/lib/LanguageContext";

type Props = { isOpen: boolean; onClose: () => void };
type Done = { orderId: string; amount: number };

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const { t } = useLanguage();

  async function handleCheckout(address: string, phone: string) {
    setLoading(true);
    setMessage(null);
    const { data } = await supabase.auth.getSession();
    const userEmail = data.session?.user?.email;
    if (!userEmail) { setMessage(t.nav_signin); setLoading(false); return; }
    const amount = totalPrice;
    const { orderId, error } = await placeOrder(userEmail, items, address, phone);
    if (error || !orderId) { setMessage(error ?? "Алдаа гарлаа."); setLoading(false); return; }
    clearCart();
    setShowCheckout(false);
    setDone({ orderId, amount });
    setLoading(false);
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      )}

      <div className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{ width: "min(380px, 100vw)", backgroundColor: "var(--bg-main)", borderLeft: "1px solid var(--border)", transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>

        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">{t.cart_title}</h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }} className="text-xl hover:opacity-60 transition-opacity">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }} className="text-sm text-center mt-10">
              {message ?? t.cart_empty}
            </p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-start"
                style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
                <div style={{ backgroundColor: "var(--surface)", borderRadius: "8px", width: "64px", height: "64px", flexShrink: 0 }}
                  className="overflow-hidden flex items-center justify-center">
                  {item.product.image_url
                    ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    : <span className="text-xl">✦</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold truncate">{item.product.name}</p>
                  <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">{t.cart_qty}: {item.quantity}</p>
                  <p style={{ color: "var(--text-primary)" }} className="text-sm mt-1">
                    ₮{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => removeItem(item.product.id)}
                  style={{ color: "var(--text-secondary)" }} className="text-xs hover:opacity-60 transition-opacity mt-1">
                  {t.cart_remove}
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && !showCheckout && !done && (
          <div className="px-6 py-5 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
            {message && <p style={{ color: "#dc2626" }} className="text-xs text-center">{message}</p>}
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }} className="text-sm">{t.cart_total}</span>
              <span style={{ color: "var(--text-primary)" }} className="font-semibold text-lg">₮{totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={() => setShowCheckout(true)}
              style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }}
              className="w-full py-3 text-sm font-semibold hover:opacity-80 transition-opacity">
              {t.cart_checkout}
            </button>
            <button onClick={clearCart} style={{ color: "var(--text-secondary)" }}
              className="text-xs text-center hover:opacity-60 transition-opacity">
              {t.cart_clear}
            </button>
          </div>
        )}

        {items.length > 0 && showCheckout && !done && (
          <CheckoutForm loading={loading} onSubmit={handleCheckout} onCancel={() => setShowCheckout(false)} />
        )}

        {done && (
          <BankTransferInfo orderId={done.orderId} amount={done.amount}
            onClose={() => { setDone(null); onClose(); }} />
        )}
      </div>
    </>
  );
}
