"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div
      style={{
        backgroundColor: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "40px",
      }}
      className="w-full max-w-md"
    >
      <h1 style={{ color: "var(--text-primary)" }} className="text-2xl font-bold mb-2">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-8">
        {mode === "login" ? "Sign in to continue your journey" : "Begin your cosmic journey"}
      </p>

      {error && (
        <p className="text-red-500 text-xs mb-4">{error}</p>
      )}

      {/* Google button */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        style={{ border: "1px solid var(--border)", borderRadius: "8px" }}
        className="w-full flex items-center justify-center gap-3 py-3 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 bg-white"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.8 39.8 16.4 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.2C41 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
        </svg>
        {loading ? "Redirecting..." : `Continue with Google`}
      </button>

      <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center mt-6">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          style={{ color: "var(--text-primary)" }}
          className="font-semibold underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
