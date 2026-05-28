"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("error")) {
      setLinkError(t.reset_invalid);
      return;
    }

    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setLinkError(t.reset_invalid);
        else setReady(true);
      });
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        subscription.unsubscribe();
      }
    });
    return () => subscription.unsubscribe();
  }, [t.reset_invalid]);

  const passwordError = password.length > 0 && password.length < 8 ? t.err_pass_short : "";
  const confirmError = confirm.length > 0 && confirm !== password ? t.err_pass_match : "";
  const isValid = password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setSubmitError(error.message);
    else { setDone(true); setTimeout(() => router.push("/login"), 2000); }
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
          <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold mb-1">{t.reset_done_title}</p>
          <p style={{ color: "var(--text-secondary)" }} className="text-xs">{t.reset_done_sub}</p>
        </div>
      </main>
    );
  }

  if (linkError) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div style={cardStyle} className="w-full max-w-md text-center">
          <p className="text-red-500 text-sm mb-4">{linkError}</p>
          <button onClick={() => router.push("/login")} style={{ color: "var(--text-primary)" }}
            className="text-xs underline hover:opacity-70 transition-opacity">
            {t.reset_back}
          </button>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">{t.reset_verifying}</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <div style={cardStyle} className="w-full max-w-md">
        <h1 style={{ color: "var(--text-primary)" }} className="text-2xl font-bold mb-2">{t.reset_title}</h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm mb-8">{t.reset_sub}</p>

        {submitError && (
          <div className="mb-4">
            <p className="text-red-500 text-xs">{submitError}</p>
            <button onClick={() => router.push("/login")} style={{ color: "var(--text-primary)" }}
              className="text-xs underline mt-2 hover:opacity-70 transition-opacity">
              {t.reset_back}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input type="password" placeholder={t.reset_new} value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle(!!passwordError)} />
          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}

          <input type="password" placeholder={t.reset_confirm} value={confirm}
            onChange={(e) => setConfirm(e.target.value)} style={inputStyle(!!confirmError)} className="mt-2" />
          {confirmError && <p className="text-red-500 text-xs">{confirmError}</p>}

          <button type="submit" disabled={loading || !isValid}
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "8px", marginTop: "12px", opacity: !isValid ? 0.4 : 1 }}
            className="w-full py-3 text-sm font-semibold transition-opacity">
            {loading ? t.reset_saving : t.reset_save}
          </button>
        </form>
      </div>
    </main>
  );
}
