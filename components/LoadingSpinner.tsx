"use client";

import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  fullPage?: boolean;
};

export default function LoadingSpinner({ fullPage = false }: Props) {
  const { t } = useLanguage();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${fullPage ? "min-h-[60vh]" : "py-20"}`}
    >
      <div className="flex items-center gap-2">
        <span
          style={{ color: "var(--text-secondary)", fontSize: "22px" }}
          className="animate-pulse"
        >
          ✦
        </span>
        <span
          style={{ color: "var(--text-secondary)", fontSize: "20px", animationDelay: "0.2s" }}
          className="animate-pulse"
        >
          ✦
        </span>
        <span
          style={{ color: "var(--text-secondary)", fontSize: "18px", animationDelay: "0.4s" }}
          className="animate-pulse"
        >
          ✦
        </span>
      </div>
      <p style={{ color: "var(--text-secondary)" }} className="text-sm tracking-wide">
        {t.loading}
      </p>
    </div>
  );
}
