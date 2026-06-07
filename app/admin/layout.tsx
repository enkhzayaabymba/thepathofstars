"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/adminCheck";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function verify() {
      // Rule 2: Check 1 — is user logged in?
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      // Rule 2: Check 2 — is user an admin? (DB-verified, not email string)
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) { router.push("/"); return; }

      setChecking(false);
    }
    verify();
  }, [router]);

  if (checking) {
    return (
      <div style={{ backgroundColor: "var(--bg-main)" }} className="flex items-center justify-center min-h-screen">
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">Checking access...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg-main)" }} className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setSidebarOpen(false)} />
      )}

      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <main className="flex-1 overflow-auto min-w-0">
        <div className="md:hidden flex items-center px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: "var(--text-primary)" }}
            className="hover:opacity-70 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="14" height="14" rx="2"/>
              <line x1="7" y1="2" x2="7" y2="16"/>
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-10 max-w-5xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
