"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

export default function CartButton() {
  const { totalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setLoggedIn(!!s));
    return () => subscription.unsubscribe();
  }, []);

  function handleClick() {
    if (!loggedIn) { router.push("/login"); return; }
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="relative hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-primary)" }}
        aria-label={loggedIn ? "Open cart" : t.nav_signin}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>

        {loggedIn && totalCount > 0 && (
          <span className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
            style={{ backgroundColor: "#c0392b", fontSize: "10px" }}>
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      {loggedIn && <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
