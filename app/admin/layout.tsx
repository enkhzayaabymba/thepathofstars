"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      if (!email || email !== ADMIN_EMAIL) {
        router.push("/");
      } else {
        setChecking(false);
      }
    });
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
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <main className="flex-1 overflow-auto min-w-0">
        {/* Top bar with toggle */}
        <div
          className="flex items-center gap-3 px-4 h-12 sticky top-0 z-30"
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
        >
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ color: "var(--text-primary)" }}
            className="text-lg hover:opacity-70 transition-opacity"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <p style={{ color: "var(--text-secondary)" }} className="text-xs font-medium">Admin Panel</p>
        </div>

        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}
