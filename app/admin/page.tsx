"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import { supabase } from "@/lib/supabase";

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, totalProducts: 0 });

  useEffect(() => {
    async function loadStats() {
      const [{ data: orders }, { data: products }] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("products").select("*"),
      ]);

      setStats({
        totalOrders: orders?.length ?? 0,
        totalRevenue: orders?.reduce((sum, o) => sum + Number(o.price), 0) ?? 0,
        pendingOrders: orders?.filter((o) => o.status === "pending").length ?? 0,
        totalProducts: products?.length ?? 0,
      });
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Welcome back — here&apos;s what&apos;s happening.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatsCard label="Total Revenue" value={`₮${stats.totalRevenue.toLocaleString()}`} icon="💰" sub="All time" />
        <StatsCard label="Total Orders" value={stats.totalOrders} icon="📦" sub="All time" />
        <StatsCard label="Pending Orders" value={stats.pendingOrders} icon="⏳" sub="Needs attention" />
        <StatsCard label="Products" value={stats.totalProducts} icon="🃏" sub="In store" />
      </div>

      <div>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="flex gap-3">
          <a href="/admin/orders"
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }}
            className="text-sm px-6 py-2.5 hover:opacity-80 transition-opacity">
            View Orders
          </a>
          <a href="/shop"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }}
            className="text-sm px-6 py-2.5 hover:opacity-70 transition-opacity">
            View Shop
          </a>
        </div>
      </div>
    </div>
  );
}
