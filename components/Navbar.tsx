"use client";

import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import CartButton from "@/components/CartButton";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/reading", label: "Reading" },
];

export default function Navbar() {
  return (
    <header
      style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-300 mx-auto px-10 h-16 flex items-center justify-between">
        <Link href="/" style={{ color: "var(--text-primary)" }} className="text-lg font-bold tracking-tight">
          ✦ The Path of Stars
        </Link>

        <nav className="flex items-center gap-8">
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
      </div>
    </header>
  );
}
