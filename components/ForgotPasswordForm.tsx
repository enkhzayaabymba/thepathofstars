"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/authHelpers";
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  onBack: () => void;
};

export default function ForgotPasswordForm({ onBack }: Props) {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  async function handleReset() {
    if (!isValidEmail(resetEmail)) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
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
      style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px" }}
      className="w-full max-w-md"
    >
      <h1 style={{ color: "var(--text-primary)" }} className="text-2xl font-bold mb-2">{t.forgot_title}</h1>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-8">{t.forgot_sub}</p>

      {resetSent ? (
        <p className="text-green-600 text-sm mb-4">{t.forgot_sent}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <input
            type="email" placeholder={t.forgot_email} value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)} style={inputStyle}
          />
          <button
            onClick={handleReset}
            disabled={loading || !isValidEmail(resetEmail)}
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "8px", opacity: !isValidEmail(resetEmail) ? 0.4 : 1 }}
            className="w-full py-3 text-sm font-semibold transition-opacity">
            {loading ? t.forgot_sending : t.forgot_send}
          </button>
        </div>
      )}

      <button onClick={onBack} style={{ color: "var(--text-secondary)" }}
        className="text-xs mt-6 hover:opacity-70 transition-opacity">
        {t.forgot_back}
      </button>
    </div>
  );
}
