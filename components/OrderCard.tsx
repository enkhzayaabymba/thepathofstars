"use client";

import { Order } from "@/lib/types";

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  payment_pending:   { color: "#d97706", bg: "#fef3c7", label: "Төлбөр хүлээгдэж байна" },
  payment_confirmed: { color: "#0891b2", bg: "#cffafe", label: "Төлбөр баталгаажсан" },
  preparing:         { color: "#7c3aed", bg: "#ede9fe", label: "Захиалга бэлтгэгдэж байна" },
  out_for_delivery:  { color: "#2563eb", bg: "#dbeafe", label: "Хүргэлтэнд гарсан" },
  delivered:         { color: "#16a34a", bg: "#dcfce7", label: "Хүргэгдсэн" },
  cancelled:         { color: "#dc2626", bg: "#fee2e2", label: "Цуцлагдсан" },
  // Өмнөх захиалгуудын backward compatibility
  pending:           { color: "#d97706", bg: "#fef3c7", label: "Төлбөр хүлээгдэж байна" },
};

type GroupedOrder = {
  order_id: string;
  items: Order[];
  total: number;
  status: string;
  created_at: string;
};

type Props = {
  order: GroupedOrder;
};

export default function OrderCard({ order }: Props) {
  const s = statusStyle[order.status] ?? { color: "#6b7280", bg: "#f3f4f6", label: order.status };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Order header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
      >
        <p style={{ color: "var(--text-secondary)" }} className="text-xs">
          {new Date(order.created_at).toLocaleDateString()}
        </p>
        <span
          style={{ color: s.color, backgroundColor: s.bg, borderRadius: "4px" }}
          className="text-xs font-medium px-2 py-1"
        >
          {s.label}
        </span>
      </div>

      {/* Items list */}
      <div className="flex flex-col">
        {order.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-5 py-4"
            style={index > 0 ? { borderTop: "1px solid var(--border)" } : {}}
          >
            {/* Product image */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-main)",
                flexShrink: 0,
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
              className="flex items-center justify-center"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
              ) : (
                <span style={{ color: "var(--text-secondary)" }} className="text-lg">✦</span>
              )}
            </div>

            {/* Name + unit price */}
            <div className="flex-1 min-w-0">
              <p style={{ color: "var(--text-primary)" }} className="text-sm font-medium truncate">
                {item.product_name}
              </p>
              <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">
                ${Number(item.price).toFixed(2)} × {item.quantity}
              </p>
            </div>

            {/* Line total */}
            <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold shrink-0">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Order total */}
      <div
        className="flex justify-between items-center px-5 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p style={{ color: "var(--text-secondary)" }} className="text-xs">
          Order total
        </p>
        <p style={{ color: "var(--text-primary)" }} className="text-sm font-bold">
          ${order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export type { GroupedOrder };
