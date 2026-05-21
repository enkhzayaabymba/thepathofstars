"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { isValidEmail, friendlyError } from "@/lib/authHelpers";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const emailError = email.length > 0 && !isValidEmail(email)
    ? "Please enter a valid email address."
    : "";
  const passwordError = mode === "signup" && password.length > 0 && password.length < 8
    ? "Password must be at least 8 characters."
    : "";
  const isFormValid = mode === "signup"
    ? isValidEmail(email) && password.length >= 8
    : isValidEmail(email) && password.length > 0;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isFormValid) return;
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(friendlyError(error.message));
      else router.push("/login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(friendlyError(error.message));
      else router.push("/");
    }

    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  const inputStyle = (hasError: boolean) => ({
    border: `1px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    borderRadius: "8px",
    backgroundColor: "var(--bg-main)",
    color: "var(--text-primary)",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
  });

  if (showReset) {
    return <ForgotPasswordForm onBack={() => setShowReset(false)} />;
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

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-1 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle(!!emailError)}
          className="mb-1"
        />
        {emailError && <p className="text-red-500 text-xs mb-2">{emailError}</p>}

        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle(!!passwordError), paddingRight: "44px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{ color: "var(--text-secondary)", position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}
            className="text-xs hover:opacity-70 transition-opacity"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {passwordError && <p className="text-red-500 text-xs mb-2 mt-1">{passwordError}</p>}
        {mode === "signup" && !passwordError && password.length === 0 && (
          <p style={{ color: "var(--text-secondary)" }} className="text-xs mb-2">Minimum 8 characters</p>
        )}

        {mode === "login" && (
          <button
            type="button"
            onClick={() => setShowReset(true)}
            style={{ color: "var(--text-secondary)" }}
            className="text-xs text-right hover:opacity-70 transition-opacity mb-1"
          >
            Forgot password?
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-main)",
            borderRadius: "8px",
            marginTop: "8px",
            opacity: !isFormValid ? 0.4 : 1,
          }}
          className="w-full py-3 text-sm font-semibold transition-opacity"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <div className="flex items-center gap-3 mb-4">
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
        <span style={{ color: "var(--text-secondary)" }} className="text-xs">or</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
      </div>

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
        Continue with Google
      </button>

      <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center mt-6">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link href={mode === "login" ? "/signup" : "/login"} style={{ color: "var(--text-primary)" }} className="font-semibold underline">
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
