import { supabase } from "@/lib/supabase";

type Order = {
  id: number;
  user_email: string;
  product_name: string;
  price: number;
  status: string;
  created_at: string;
};

async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Order[];
}

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  completed: { color: "#16a34a", bg: "#dcfce7", label: "Completed" },
  pending:   { color: "#d97706", bg: "#fef3c7", label: "Pending" },
  cancelled: { color: "#dc2626", bg: "#fee2e2", label: "Cancelled" },
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">
          Orders
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          {orders.length} total orders
        </p>
      </div>

      {/* Table */}
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
          className="grid grid-cols-6 px-6 py-3"
        >
          {["ID", "Customer", "Product", "Price", "Status", "Date"].map((h) => (
            <p key={h} style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-wide">
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {orders.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }} className="text-sm px-6 py-8">
            No orders yet.
          </p>
        ) : (
          orders.map((order) => {
            const s = statusStyle[order.status] ?? { color: "#6b7280", bg: "#f3f4f6", label: order.status };
            return (
              <div
                key={order.id}
                style={{ borderBottom: "1px solid var(--border)" }}
                className="grid grid-cols-6 px-6 py-4 items-center hover:opacity-80 transition-opacity"
              >
                <p style={{ color: "var(--text-secondary)" }} className="text-sm">#{order.id}</p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm truncate pr-2">{order.user_email}</p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm truncate pr-2">{order.product_name}</p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">${Number(order.price).toFixed(2)}</p>
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
