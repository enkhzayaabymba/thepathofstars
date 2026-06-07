"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CartButton from "@/components/CartButton";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { checkIsAdmin } from "@/lib/adminCheck";

function AvatarDropdown({ email, isAdmin, onLogout }: { email: string; isAdmin: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", width: "34px", height: "34px", borderRadius: "50%" }}
        className="flex items-center justify-center text-sm font-semibold hover:opacity-80 transition-opacity"
      >
        {email[0].toUpperCase()}
      </button>

      {open && (
        <div
          style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", minWidth: "200px", right: 0, top: "42px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          className="absolute z-50 flex flex-col overflow-hidden"
        >
          <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-3">
            <p style={{ color: "var(--text-secondary)" }} className="text-xs truncate">{email}</p>
          </div>
          <Link href={isAdmin ? "/admin" : "/orders"} onClick={() => setOpen(false)}
            style={{ color: "var(--text-primary)" }} className="px-4 py-3 text-sm hover:opacity-70 transition-opacity">
            {isAdmin ? `◈ ${t.nav_admin}` : t.nav_orders}
          </Link>
          <button onClick={onLogout}
            style={{ color: "var(--text-primary)", borderTop: "1px solid var(--border)" }}
            className="px-4 py-3 text-sm text-left hover:opacity-70 transition-opacity">
            {t.nav_logout}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setEmail(s?.user?.email ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!email) { setIsAdmin(false); return; }
    checkIsAdmin().then(setIsAdmin);
  }, [email]);

  async function logout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  }

  const links = [
    { href: "/shop", label: t.nav_shop, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { href: "/reading", label: t.nav_reading, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L9.5 8.5 3 9.27l5 4.87L6.82 21 12 17.77 17.18 21 16 14.14l5-4.87-6.5-.77L12 2z"/></svg> },
  ];

  const hr = <div style={{ height: "1px", backgroundColor: "var(--border)" }} />;
  return (
    <header style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }} className="sticky top-0 z-50">
      <div className="max-w-300 mx-auto px-4 md:px-10 h-16 flex items-center justify-between relative">
        <Link href="/" style={{ color: "var(--text-primary)" }} className="text-lg font-bold tracking-tight shrink-0">
          ✦ The Path of Stars
        </Link>
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "var(--text-secondary)" }}
              className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity">
              {link.icon}{link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <CartButton />
          <button onClick={toggleTheme}
            style={{ border: "1px solid var(--border)", borderRadius: "100px", backgroundColor: "var(--surface)" }}
            className="flex items-center gap-1 px-2 py-1.5 text-base hover:opacity-70 transition-opacity">
            <span style={{ opacity: theme === "light" ? 1 : 0.35 }}>☀</span>
            <span style={{ opacity: theme === "dark" ? 1 : 0.35 }}>🌙</span>
          </button>
          <button onClick={() => setLang(lang === "en" ? "mn" : "en")}
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }}
            className="text-sm px-4 py-1.5 hover:opacity-70 transition-opacity">
            {lang === "en" ? "MN" : "EN"}
          </button>
          {email
            ? <AvatarDropdown email={email} isAdmin={isAdmin} onLogout={logout} />
            : <Link href="/login" style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
                className="text-sm px-5 py-2 rounded-full hover:opacity-80 transition-opacity">{t.nav_signin}</Link>
          }
        </div>
        <div className="flex md:hidden items-center gap-3">
          <CartButton />
          <button onClick={() => setMenuOpen((v) => !v)} style={{ color: "var(--text-primary)" }} className="hover:opacity-70 transition-opacity" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
          className="md:hidden flex flex-col">

          {email && (
            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "50%", width: "34px", height: "34px", flexShrink: 0 }} className="flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-secondary)" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p style={{ color: "var(--text-primary)" }} className="text-sm truncate flex-1">{email}</p>
              <span style={{ backgroundColor: isAdmin ? "var(--text-primary)" : "var(--surface)", color: isAdmin ? "var(--bg-main)" : "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "100px", fontSize: "10px", padding: "2px 8px", flexShrink: 0, fontWeight: 600 }}>
                {isAdmin ? "Admin" : "Client"}
              </span>
            </div>
          )}

          <div className="px-5 py-2 flex flex-col gap-1">
            <p style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-widest mb-1">{t.menu_label}</p>
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ color: "var(--text-primary)" }}
                className="flex items-center gap-2 py-2 text-sm hover:opacity-70 transition-opacity">
                {link.icon}{link.label}
              </Link>
            ))}
            {email && (
              <Link href={isAdmin ? "/admin" : "/orders"} onClick={() => setMenuOpen(false)}
                style={{ color: "var(--text-primary)" }}
                className="py-2 text-sm hover:opacity-70 transition-opacity">
                {isAdmin ? `◈ ${t.nav_admin}` : t.nav_orders}
              </Link>
            )}
          </div>

          {hr}
          <div className="px-5 py-2 flex flex-col">
            <p style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-widest mb-1">{t.settings_label}</p>
            <div className="flex items-center justify-between py-2">
              <span style={{ color: "var(--text-primary)" }} className="text-sm">{t.theme_label}</span>
              <button onClick={toggleTheme}
                style={{ border: "1px solid var(--border)", borderRadius: "100px", backgroundColor: "var(--surface)" }}
                className="flex items-center gap-1 px-2 py-1.5 text-base hover:opacity-70 transition-opacity">
                <span style={{ opacity: theme === "light" ? 1 : 0.35 }}>☀</span>
                <span style={{ opacity: theme === "dark" ? 1 : 0.35 }}>🌙</span>
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span style={{ color: "var(--text-primary)" }} className="text-sm">{t.lang_label}</span>
              <button onClick={() => setLang(lang === "en" ? "mn" : "en")}
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }}
                className="text-sm px-4 py-1.5 hover:opacity-70 transition-opacity">
                {lang === "en" ? "MN" : "EN"}
              </button>
            </div>
          </div>

          {hr}
          <div className="px-5 py-3">
            {email
              ? <button onClick={logout} style={{ color: "var(--text-primary)" }}
                  className="text-sm hover:opacity-70 transition-opacity">{t.nav_logout}</button>
              : <Link href="/login" onClick={() => setMenuOpen(false)}
                  style={{ color: "var(--text-primary)" }} className="text-sm hover:opacity-70 transition-opacity">
                  {t.nav_signin}
                </Link>
            }
          </div>
        </div>
      )}
    </header>
  );
}
