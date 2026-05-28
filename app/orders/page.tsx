"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMyOrders } from "@/lib/orderService";
import { Order } from "@/lib/types";
import OrderCard, { GroupedOrder } from "@/components/OrderCard";
import { useLanguage } from "@/lib/LanguageContext";

const PAGE_SIZE = 5;
const POLL_INTERVAL = 15000;

function groupOrders(orders: Order[]): GroupedOrder[] {
  const map = new Map<string, GroupedOrder>();
  for (const row of orders) {
    const key = row.order_id ?? String(row.id);
    if (!map.has(key)) {
      map.set(key, { order_id: key, items: [], total: 0, status: row.status, created_at: row.created_at });
    }
    const g = map.get(key)!;
    g.items.push(row);
    g.total += Number(row.price) * (row.quantity ?? 1);
  }
  return Array.from(map.values());
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [grouped, setGrouped] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { t } = useLanguage();

  const fetchOrders = useCallback(async (userEmail: string) => {
    const orders = await getMyOrders(userEmail);
    setGrouped(groupOrders(orders));
  }, []);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      const userEmail = data.session?.user?.email;
      if (!userEmail) { router.push("/login"); return; }
      setEmail(userEmail);
      await fetchOrders(userEmail);
      setLoading(false);
    }
    init();
  }, [router, fetchOrders]);

  useEffect(() => {
    if (!email) return;
    const interval = setInterval(() => fetchOrders(email), POLL_INTERVAL);
    function onVisible() {
      if (document.visibilityState === "visible") fetchOrders(email!);
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [email, fetchOrders]);

  const totalPages = Math.ceil(grouped.length / PAGE_SIZE);
  const paginated = grouped.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">{t.orders_loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-2">{t.orders_title}</h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-10">
        {grouped.length === 0 ? t.orders_empty : t.orders_count.replace("{n}", String(grouped.length))}
      </p>

      <div className="flex flex-col gap-4">
        {paginated.map((order) => (
          <OrderCard key={order.order_id} order={order} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-8 justify-center">
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
