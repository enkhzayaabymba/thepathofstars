"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMyOrders } from "@/lib/orderService";
import { Order } from "@/lib/types";
import OrderCard, { GroupedOrder } from "@/components/OrderCard";

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
    group.items.push(row);
    group.total += Number(row.price) * (row.quantity ?? 1);
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
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-2">
        My Orders
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-10">
        {grouped.length === 0 ? "You have no orders yet." : `${grouped.length} orders`}
      </p>

      <div className="flex flex-col gap-4">
        {grouped.map((order) => (
          <OrderCard key={order.order_id} order={order} />
        ))}
      </div>
    </div>
  );
}
