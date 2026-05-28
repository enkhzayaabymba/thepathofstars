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

const ToggleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="14" height="14" rx="2"/>
    <line x1="7" y1="2" x2="7" y2="16"/>
  </svg>
);

export default function AdminSidebar({ isOpen, onToggle }: Props) {
  const pathname = usePathname();
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    async function checkNew() {
      const lastViewed = localStorage.getItem(LAST_VIEWED_KEY) ?? "1970-01-01T00:00:00.000Z";
      const { data } = await supabase.from("orders").select("id, order_id").gt("created_at", lastViewed);
      if (!data) return;
      const unique = new Set(data.map((r) => r.order_id ?? String(r.id)));
      setNewOrders(unique.size);
    }
    checkNew();
    const interval = setInterval(checkNew, 10000);
    window.addEventListener("orders-seen", checkNew);
    return () => { clearInterval(interval); window.removeEventListener("orders-seen", checkNew); };
  }, []);

  const links = [
    { href: "/admin", label: "Dashboard", icon: "▦" },
    { href: "/admin/products", label: "Products", icon: "🃏" },
    { href: "/admin/orders", label: "Orders", icon: "✦", badge: newOrders },
  ];

  const desktopSidebar = (
    <aside
      className="hidden md:flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
      style={{ width: isOpen ? "220px" : "56px", borderRight: "1px solid var(--border)", backgroundColor: "var(--surface)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)" }} className={`flex items-center py-4 ${isOpen ? "justify-between px-5" : "justify-center px-0"}`}>
        {isOpen && (
          <div>
            <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">✦ Path of Stars</p>
            <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">Admin Panel</p>
          </div>
        )}
        <button onClick={onToggle} style={{ color: "var(--text-secondary)" }} className="hover:opacity-70 transition-opacity">
          <ToggleIcon />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              style={{ backgroundColor: isActive ? "var(--bg-main)" : "transparent", color: isActive ? "var(--text-primary)" : "var(--text-secondary)", borderRadius: "8px", fontWeight: isActive ? "600" : "400" }}
              className={`flex items-center py-2.5 text-sm hover:opacity-70 transition-all ${isOpen ? "gap-3 px-4" : "justify-center px-0"}`}
              title={!isOpen ? link.label : undefined}
            >
              <span className="text-base shrink-0">{link.icon}</span>
              {isOpen && <span className="flex-1">{link.label}</span>}
              {isOpen && link.badge != null && link.badge > 0 && (
                <span style={{ backgroundColor: "#dc2626", color: "#fff", borderRadius: "100px", fontSize: "10px", minWidth: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", fontWeight: 700 }}>
                  {link.badge}
                </span>
              )}
              {!isOpen && link.badge != null && link.badge > 0 && (
                <span style={{ position: "absolute", top: "6px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#dc2626" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div style={{ borderTop: "1px solid var(--border)" }} className="px-5 py-4">
          <Link href="/" style={{ color: "var(--text-secondary)" }} className="text-xs hover:opacity-70 transition-opacity">
            ← Back to site
          </Link>
        </div>
      )}
    </aside>
  );

  const mobileSidebar = (
    <aside
      className="fixed top-0 left-0 h-full z-50 flex flex-col md:hidden transition-transform duration-300"
      style={{ width: "220px", borderRight: "1px solid var(--border)", backgroundColor: "var(--surface)", transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
    >
      <div style={{ borderBottom: "1px solid var(--border)" }} className="px-5 py-4 flex items-center justify-between">
        <div>
          <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">✦ Path of Stars</p>
          <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">Admin Panel</p>
        </div>
        <button onClick={onToggle} style={{ color: "var(--text-secondary)" }} className="hover:opacity-70 transition-opacity">
          <ToggleIcon />
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={onToggle}
              style={{ backgroundColor: isActive ? "var(--bg-main)" : "transparent", color: isActive ? "var(--text-primary)" : "var(--text-secondary)", borderRadius: "8px", fontWeight: isActive ? "600" : "400" }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-all">
              <span className="text-base">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.badge != null && link.badge > 0 && (
                <span style={{ backgroundColor: "#dc2626", color: "#fff", borderRadius: "100px", fontSize: "10px", minWidth: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", fontWeight: 700 }}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div style={{ borderTop: "1px solid var(--border)" }} className="px-5 py-4">
        <Link href="/" style={{ color: "var(--text-secondary)" }} className="text-xs hover:opacity-70 transition-opacity">← Back to site</Link>
      </div>
    </aside>
  );

  return <>{mobileSidebar}{desktopSidebar}</>;
}
