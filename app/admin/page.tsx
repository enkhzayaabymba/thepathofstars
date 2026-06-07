import StatsCard from "@/components/admin/StatsCard";
import { supabase } from "@/lib/supabase";

async function getStats() {
  const { data: orders } = await supabase.from("orders").select("*");
  const { data: products } = await supabase.from("products").select("*");

  const totalOrders = orders?.length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.price), 0) ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? 0;
  const totalProducts = products?.length ?? 0;

  return { totalOrders, totalRevenue, pendingOrders, totalProducts };
}

export default async function AdminDashboard() {
  const { totalOrders, totalRevenue, pendingOrders, totalProducts } = await getStats();

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Welcome back — here's what's happening.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatsCard label="Total Revenue" value={`₮${totalRevenue.toLocaleString()}`} icon="💰" sub="All time" />
        <StatsCard label="Total Orders" value={totalOrders} icon="📦" sub="All time" />
        <StatsCard label="Pending Orders" value={pendingOrders} icon="⏳" sub="Needs attention" />
        <StatsCard label="Products" value={totalProducts} icon="🃏" sub="In store" />
      </div>

      {/* Quick links */}
      <div>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="flex gap-3">
          <a
            href="/admin/orders"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-main)",
              borderRadius: "100px",
            }}
            className="text-sm px-6 py-2.5 hover:opacity-80 transition-opacity"
          >
            View Orders
          </a>
          <a
            href="/shop"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              borderRadius: "100px",
            }}
            className="text-sm px-6 py-2.5 hover:opacity-70 transition-opacity"
          >
            View Shop
          </a>
        </div>
      </div>
    </div>
  );
}
