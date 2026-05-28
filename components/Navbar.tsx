"use client";

import { useState } from "react";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import CartButton from "@/components/CartButton";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { href: "/shop", label: t.nav_shop },
    { href: "/reading", label: t.nav_reading },
  ];

  return (
    <header
      style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-300 mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" style={{ color: "var(--text-primary)" }} className="text-lg font-bold tracking-tight">
          ✦ The Path of Stars
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "var(--text-secondary)" }}
              className="text-sm hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}

          <CartButton />
          <NavAuth />
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <CartButton />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ color: "var(--text-primary)" }}
            className="text-xl p-1 hover:opacity-70 transition-opacity"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
          className="md:hidden px-4 py-4 flex flex-col gap-4"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "var(--text-secondary)" }}
              className="text-sm hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div onClick={() => setMenuOpen(false)}>
            <NavAuth />
          </div>
        </div>
      )}
    </header>
  );
}
