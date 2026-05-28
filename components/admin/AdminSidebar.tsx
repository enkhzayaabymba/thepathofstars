"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

const LAST_VIEWED_KEY = "admin_orders_last_viewed";

export default function AdminSidebar({ isOpen, onToggle }: Props) {
  const pathname = usePathname();
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    async function checkNew() {
      const lastViewed = localStorage.getItem(LAST_VIEWED_KEY) ?? "1970-01-01T00:00:00.000Z";
      const { data } = await supabase
        .from("orders")
        .select("id, order_id")
        .gt("created_at", lastViewed);
      if (!data) return;
      const unique = new Set(data.map((r) => r.order_id ?? String(r.id)));
      setNewOrders(unique.size);
    }

    checkNew();
    const interval = setInterval(checkNew, 10000);
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

  const sidebarContent = (
    <>
      <div style={{ borderBottom: "1px solid var(--border)" }} className="px-6 py-5 flex items-center justify-between">
        <div>
          <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">✦ Path of Stars</p>
          <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">Admin Panel</p>
        </div>
        <button
          onClick={onToggle}
          style={{ color: "var(--text-secondary)" }}
          className="text-base hover:opacity-70 transition-opacity md:flex hidden"
          aria-label="Close sidebar"
        >
          ✕
        </button>
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
    </>
  );

  return (
    <>
      {/* Mobile: fixed overlay drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col md:hidden transition-transform duration-300"
        style={{
          width: "220px",
          borderRight: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop: inline collapsible */}
      <aside
        className="hidden md:flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        style={{
          width: isOpen ? "220px" : "0px",
          borderRight: isOpen ? "1px solid var(--border)" : "none",
          backgroundColor: "var(--surface)",
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
