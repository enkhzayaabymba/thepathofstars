"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/authHelpers";

type Props = {
  onBack: () => void;
};

export default function ForgotPasswordForm({ onBack }: Props) {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleReset() {
    if (!isValidEmail(resetEmail)) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetSent(true);
    setLoading(false);
  }

  const inputStyle = {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    backgroundColor: "var(--bg-main)",
    color: "var(--text-primary)",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
  };

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
        Reset password
      </h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-8">
        We will send a password reset link to your email.
      </p>

      {resetSent ? (
        <p className="text-green-600 text-sm mb-4">
          Reset link sent! Check your email inbox.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleReset}
            disabled={loading || !isValidEmail(resetEmail)}
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-main)",
              borderRadius: "8px",
              opacity: !isValidEmail(resetEmail) ? 0.4 : 1,
            }}
            className="w-full py-3 text-sm font-semibold transition-opacity"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      )}

      <button
        onClick={onBack}
        style={{ color: "var(--text-secondary)" }}
        className="text-xs mt-6 hover:opacity-70 transition-opacity"
      >
        ← Back to sign in
      </button>
    </div>
  );
}
