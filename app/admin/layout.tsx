"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

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
      <div
        style={{ backgroundColor: "var(--bg-main)" }}
        className="flex items-center justify-center min-h-screen"
      >
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Checking access...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg-main)" }} className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-10 overflow-auto">{children}</main>
    </div>
  );
}
