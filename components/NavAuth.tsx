"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (email) {
    return (
      <div className="flex items-center gap-4">
        <span style={{ color: "var(--text-secondary)" }} className="text-xs hidden md:block">
          {email}
        </span>
        <button
          onClick={handleLogout}
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          className="text-sm px-5 py-2 rounded-full hover:opacity-70 transition-opacity"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
      className="text-sm px-5 py-2 rounded-full hover:opacity-80 transition-opacity"
    >
      Sign In
    </Link>
  );
}
