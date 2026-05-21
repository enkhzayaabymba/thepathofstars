"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  completed: { color: "#16a34a", bg: "#dcfce7", label: "Completed" },
  pending:   { color: "#d97706", bg: "#fef3c7", label: "Pending" },
  cancelled: { color: "#dc2626", bg: "#fee2e2", label: "Cancelled" },
};

// Group individual order rows by order_id into one "order"
type GroupedOrder = {
  order_id: string;
  user_email: string;
  items: string[];
  total: number;
  status: string;
  created_at: string;
};

function groupOrders(orders: Order[]): GroupedOrder[] {
  const map = new Map<string, GroupedOrder>();

  for (const row of orders) {
    const key = row.order_id ?? String(row.id);
    if (!map.has(key)) {
      map.set(key, {
        order_id: key,
        user_email: row.user_email,
        items: [],
        total: 0,
        status: row.status,
        created_at: row.created_at,
      });
    }
    const group = map.get(key)!;
    group.items.push(row.product_name);
    group.total += Number(row.price);
  }

  return Array.from(map.values());
}

export default function OrdersPage() {
  const [grouped, setGrouped] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setGrouped(groupOrders(data as Order[]));
      setLoading(false);
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p style={{ color: "var(--text-secondary)" }} className="text-sm">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">
          Orders
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          {grouped.length} total orders
        </p>
      </div>

      <div
        style={{
          backgroundColor: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
          className="grid grid-cols-5 px-6 py-3"
        >
          {["Customer", "Items", "Total", "Status", "Date"].map((h) => (
            <p key={h} style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-wide">
              {h}
            </p>
          ))}
        </div>

        {grouped.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }} className="text-sm px-6 py-8">
            No orders yet.
          </p>
        ) : (
          grouped.map((order) => {
            const s = statusStyle[order.status] ?? { color: "#6b7280", bg: "#f3f4f6", label: order.status };
            return (
              <div
                key={order.order_id}
                style={{ borderBottom: "1px solid var(--border)" }}
                className="grid grid-cols-5 px-6 py-4 items-center"
              >
                <p style={{ color: "var(--text-primary)" }} className="text-sm truncate pr-2">{order.user_email}</p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm truncate pr-2">
                  {order.items.join(", ")}
                </p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                <span
                  style={{ color: s.color, backgroundColor: s.bg, borderRadius: "4px", width: "fit-content" }}
                  className="text-xs font-medium px-2 py-1"
                >
                  {s.label}
                </span>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
