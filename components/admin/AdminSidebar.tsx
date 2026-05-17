"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/orders", label: "Orders", icon: "✦" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
        minHeight: "100vh",
        width: "220px",
      }}
      className="flex flex-col shrink-0"
    >
      {/* Logo */}
      <div
        style={{ borderBottom: "1px solid var(--border)" }}
        className="px-6 py-5"
      >
        <p style={{ color: "var(--text-primary)" }} className="font-bold text-sm">
          ✦ Path of Stars
        </p>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                backgroundColor: isActive ? "var(--surface)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderRadius: "8px",
                fontWeight: isActive ? "600" : "400",
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-all"
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{ borderTop: "1px solid var(--border)" }}
        className="px-6 py-4"
      >
        <Link
          href="/"
          style={{ color: "var(--text-secondary)" }}
          className="text-xs hover:opacity-70 transition-opacity"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
