"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";

const STATUSES = [
  { value: "payment_pending",   label: "Төлбөр хүлээгдэж байна",   color: "#d97706", bg: "#fef3c7" },
  { value: "payment_confirmed", label: "Төлбөр баталгаажсан",       color: "#0891b2", bg: "#cffafe" },
  { value: "preparing",         label: "Захиалга бэлтгэгдэж байна", color: "#7c3aed", bg: "#ede9fe" },
  { value: "out_for_delivery",  label: "Хүргэлтэнд гарсан",         color: "#2563eb", bg: "#dbeafe" },
  { value: "delivered",         label: "Хүргэгдсэн",                color: "#16a34a", bg: "#dcfce7" },
  { value: "cancelled",         label: "Цуцлагдсан",                color: "#dc2626", bg: "#fee2e2" },
];

const COLS = "minmax(0,2fr) minmax(0,3fr) 72px minmax(0,2fr)";

type AdminOrder = {
  order_id: string;
  user_email: string;
  items: Order[];
  total: number;
  status: string;
  created_at: string;
  address?: string;
  phone?: string;
};

function groupOrders(orders: Order[]): AdminOrder[] {
  const map = new Map<string, AdminOrder>();
  for (const row of orders) {
    const key = row.order_id ?? String(row.id);
    if (!map.has(key)) {
      map.set(key, { order_id: key, user_email: row.user_email, items: [], total: 0, status: row.status, created_at: row.created_at, address: row.address, phone: row.phone });
    }
    const g = map.get(key)!;
    g.items.push(row);
    g.total += Number(row.price) * (row.quantity ?? 1);
  }
  return Array.from(map.values());
}

const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchOrders(isInitial = false) {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) {
      setOrders(groupOrders(data as Order[]));
      if (isInitial) {
        localStorage.setItem("admin_orders_last_viewed", new Date().toISOString());
        window.dispatchEvent(new CustomEvent("orders-seen"));
      }
    }
    if (isInitial) setLoading(false);
  }

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(), 10000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(order_id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("order_id", order_id);
    if (error) { alert("Update failed: " + error.message); return; }
    setOrders((prev) => prev.map((o) => o.order_id === order_id ? { ...o, status } : o));
  }

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <p style={{ color: "var(--text-secondary)" }} className="text-sm">Loading...</p>;

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">Orders</h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">{orders.length} total orders</p>
      </div>

      <div style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
        {/* Header */}
        <div className="grid gap-x-6 px-6 py-3"
          style={{ gridTemplateColumns: COLS, borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          {["Захиалагч", "Бараа", "Нийт", "Төлөв"].map((h) => (
            <p key={h} style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {orders.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }} className="text-sm px-6 py-8">No orders yet.</p>
        ) : paginated.map((order) => {
          const s = STATUSES.find((st) => st.value === order.status) ?? STATUSES[0];
          return (
            <div key={order.order_id} className="grid gap-x-6 px-6 py-5 items-start"
              style={{ gridTemplateColumns: COLS, borderBottom: "1px solid var(--border)" }}>

              {/* Customer */}
              <div className="flex flex-col gap-0.5 pt-0.5">
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-medium truncate">{order.user_email}</p>
                <p style={{ color: "var(--text-secondary)" }} className="text-xs">
                  {new Date(order.created_at).toLocaleDateString()} · #{order.order_id.slice(0, 8)}
                </p>
                {order.phone && <p style={{ color: "var(--text-secondary)" }} className="text-xs">📞 {order.phone}</p>}
                {order.address && <p style={{ color: "var(--text-secondary)" }} className="text-xs leading-snug">📍 {order.address}</p>}
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div style={{ width: "38px", height: "38px", borderRadius: "6px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", flexShrink: 0, overflow: "hidden" }}
                      className="flex items-center justify-center">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        : <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>✦</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: "var(--text-primary)" }} className="text-xs font-medium truncate">{item.product_name}</p>
                      <p style={{ color: "var(--text-secondary)" }} className="text-xs">${Number(item.price).toFixed(2)} × {item.quantity ?? 1}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <p style={{ color: "var(--text-primary)" }} className="text-sm font-bold pt-0.5">${order.total.toFixed(2)}</p>

              {/* Status dropdown */}
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.order_id, e.target.value)}
                style={{ border: `1px solid ${s.color}`, color: s.color, backgroundColor: s.bg, borderRadius: "8px", fontSize: "12px", padding: "5px 8px", outline: "none", cursor: "pointer", fontWeight: 500, width: "100%" }}
              >
                {STATUSES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-6 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                backgroundColor: page === p ? "var(--text-primary)" : "transparent",
                color: page === p ? "var(--bg-main)" : "var(--text-secondary)",
                border: `1px solid ${page === p ? "var(--text-primary)" : "var(--border)"}`,
                fontSize: "13px", fontWeight: page === p ? 600 : 400,
              }}
              className="transition-all hover:opacity-70"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
