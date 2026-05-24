"use client";

import { useEffect, useRef, useState } from "react";
import { CartItem } from "@/lib/CartContext";
import { placeOrder } from "@/lib/orderService";

type Props = {
  amount: number;
  address: string;
  phone: string;
  userEmail: string;
  items: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
};

type QPayData = {
  invoice_id: string;
  qr_image: string;
  urls: { name: string; logo: string; link: string }[];
};

export default function QPayModal({ amount, address, phone, userEmail, items, onSuccess, onCancel }: Props) {
  const [qpay, setQpay] = useState<QPayData | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const orderId = useRef(crypto.randomUUID()).current;

  useEffect(() => {
    fetch("/api/qpay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(amount), orderId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.error) setError("QPay алдаа: " + d.error); else setQpay(d); })
      .catch(() => setError("QPay холболтонд алдаа гарлаа"));
  }, []);

  useEffect(() => {
    if (!qpay) return;
    const iv = setInterval(async () => {
      if (checking) return;
      setChecking(true);
      try {
        const r = await fetch("/api/qpay/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoice_id: qpay.invoice_id }),
        });
        const d = await r.json();
        if (d.paid) {
          clearInterval(iv);
          const { error } = await placeOrder(userEmail, items, address, phone);
          if (error) { setError(error); return; }
          onSuccess();
        }
      } finally { setChecking(false); }
    }, 3000);
    return () => clearInterval(iv);
  }, [qpay]);

  return (
    <div className="flex flex-col gap-3 px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">QPay төлбөр</p>
        <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">₮{Math.round(amount).toLocaleString()}</p>
      </div>

      {!qpay && !error && (
        <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center py-8">QR код үүсгэж байна...</p>
      )}

      {error && <p className="text-xs text-red-500 text-center py-2">{error}</p>}

      {qpay && (
        <>
          <div className="flex justify-center py-1">
            <img src={`data:image/png;base64,${qpay.qr_image}`} alt="QPay QR"
              style={{ width: "168px", height: "168px", borderRadius: "8px" }} />
          </div>

          <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center">
            Банкны апп-аар QR уншуулах эсвэл доорх апп-уудаас нэгийг сонгоно уу
          </p>

          {qpay.urls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {qpay.urls.slice(0, 6).map((u) => (
                <a key={u.name} href={u.link} target="_blank" rel="noopener noreferrer"
                  style={{ border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--surface)" }}
                  className="flex flex-col items-center gap-1 p-2 hover:opacity-70 transition-opacity">
                  <img src={u.logo} alt={u.name} style={{ width: "32px", height: "32px", borderRadius: "6px" }} />
                  <span style={{ color: "var(--text-secondary)", fontSize: "9px" }} className="text-center leading-tight line-clamp-2">{u.name}</span>
                </a>
              ))}
            </div>
          )}

          <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center">
            {checking ? "⏳ Шалгаж байна..." : "💳 Төлбөрийг хүлээж байна..."}
          </p>
        </>
      )}

      <button type="button" onClick={onCancel}
        style={{ color: "var(--text-secondary)" }}
        className="text-xs text-center hover:opacity-60 transition-opacity">
        ← Буцах
      </button>
    </div>
  );
}
