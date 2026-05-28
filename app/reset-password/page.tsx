"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check hash for errors first (implicit flow sends errors in the hash)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashError = hashParams.get("error");
    if (hashError) {
      setLinkError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }

    // PKCE flow: code in query params
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setLinkError("This reset link is invalid or has expired. Please request a new one.");
        } else {
          setReady(true);
        }
      });
      return;
    }

    // Implicit flow: Supabase processes the hash automatically, listen for the event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        subscription.unsubscribe();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const passwordError = password.length > 0 && password.length < 8
    ? "Password must be at least 8 characters."
    : "";
  const confirmError = confirm.length > 0 && confirm !== password
    ? "Passwords do not match."
    : "";
  const isValid = password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setSubmitError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    }

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

  const cardStyle = {
    backgroundColor: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "40px",
  };

  if (done) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div style={cardStyle} className="w-full max-w-md text-center">
          <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold mb-1">
            Password updated!
          </p>
          <p style={{ color: "var(--text-secondary)" }} className="text-xs">
            Redirecting to login...
          </p>
        </div>
      </main>
    );
  }

  if (linkError) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div style={cardStyle} className="w-full max-w-md text-center">
          <p className="text-red-500 text-sm mb-4">{linkError}</p>
          <button
            onClick={() => router.push("/login")}
            style={{ color: "var(--text-primary)" }}
            className="text-xs underline hover:opacity-70 transition-opacity"
          >
            ← Back to login
          </button>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Verifying reset link...
        </p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <div style={cardStyle} className="w-full max-w-md">
        <h1 style={{ color: "var(--text-primary)" }} className="text-2xl font-bold mb-2">
          Set new password
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-8">
          Choose a new password for your account.
        </p>

        {submitError && (
          <div className="mb-4">
            <p className="text-red-500 text-xs">{submitError}</p>
            <button
              onClick={() => router.push("/login")}
              style={{ color: "var(--text-primary)" }}
              className="text-xs underline mt-2 hover:opacity-70 transition-opacity"
            >
              ← Back to login
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle(!!passwordError)}
          />
          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle(!!confirmError)}
            className="mt-2"
          />
          {confirmError && <p className="text-red-500 text-xs">{confirmError}</p>}

          <button
            type="submit"
            disabled={loading || !isValid}
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-main)",
              borderRadius: "8px",
              marginTop: "12px",
              opacity: !isValid ? 0.4 : 1,
            }}
            className="w-full py-3 text-sm font-semibold transition-opacity"
          >
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      </div>
    </main>
  );
}
