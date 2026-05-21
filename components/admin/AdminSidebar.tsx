"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const SEEN_KEY = "admin_seen_orders";

function getUnseenCount(orderIds: string[]): number {
  const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") as string[];
  return orderIds.filter((id) => !seen.includes(id)).length;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    async function checkNew() {
      const { data } = await supabase.from("orders").select("id, order_id");
      if (!data) return;
      const ids = [...new Set(data.map((r) => (r.order_id ?? String(r.id)) as string))];
      setNewOrders(getUnseenCount(ids));
    }

    checkNew();
    const interval = setInterval(checkNew, 30000);

    window.addEventListener("orders-seen", checkNew);
    return () => {
      clearInterval(interval);
      window.removeEventListener("orders-seen", checkNew);
    };
  }, []);

  const links = [
    { href: "/admin", label: "Dashboard", icon: "▦" },
    { href: "/admin/products", label: "Products", icon: "🃏" },
    { href: "/admin/orders", label: "Orders", icon: "✦", badge: newOrders },
  ];

  return (
    <aside
      style={{ borderRight: "1px solid var(--border)", backgroundColor: "var(--surface)", minHeight: "100vh", width: "220px" }}
      className="flex flex-col shrink-0"
    >
      <div style={{ borderBottom: "1px solid var(--border)" }} className="px-6 py-5">
        <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">✦ Path of Stars</p>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                backgroundColor: isActive ? "var(--bg-main)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderRadius: "8px",
                fontWeight: isActive ? "600" : "400",
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-all"
            >
              <span className="text-base">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.badge != null && link.badge > 0 && (
                <span
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    borderRadius: "100px",
                    fontSize: "10px",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                    fontWeight: 700,
                  }}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)" }} className="px-6 py-4">
        <Link href="/" style={{ color: "var(--text-secondary)" }} className="text-xs hover:opacity-70 transition-opacity">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
