"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMyOrders } from "@/lib/orderService";
import { Order } from "@/lib/types";

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  completed: { color: "#16a34a", bg: "#dcfce7", label: "Completed" },
  pending:   { color: "#d97706", bg: "#fef3c7", label: "Pending" },
  cancelled: { color: "#dc2626", bg: "#fee2e2", label: "Cancelled" },
};

type GroupedOrder = {
  order_id: string;
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

export default function MyOrdersPage() {
  const router = useRouter();
  const [grouped, setGrouped] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email;

      if (!email) {
        router.push("/login");
        return;
      }

      const orders = await getMyOrders(email);
      setGrouped(groupOrders(orders));
      setLoading(false);
    }

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-2">
        My Orders
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-10">
        {grouped.length === 0 ? "You have no orders yet." : `${grouped.length} orders`}
      </p>

      <div className="flex flex-col gap-4">
        {grouped.map((order) => {
          const s = statusStyle[order.status] ?? {
            color: "#6b7280",
            bg: "#f3f4f6",
            label: order.status,
          };

          return (
            <div
              key={order.order_id}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
              }}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              {/* Left: items + date */}
              <div className="flex flex-col gap-1">
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">
                  {order.items.join(", ")}
                </p>
                <p style={{ color: "var(--text-secondary)" }} className="text-xs">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Right: total + status */}
              <div className="flex items-center gap-4 shrink-0">
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">
                  ${order.total.toFixed(2)}
                </p>
                <span
                  style={{ color: s.color, backgroundColor: s.bg, borderRadius: "4px" }}
                  className="text-xs font-medium px-2 py-1"
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
