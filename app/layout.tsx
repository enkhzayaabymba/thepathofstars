import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/lib/CartContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Path of Stars — Tarot Readings & Decks",
  description: "Discover the wisdom hidden in the stars. Tarot readings, curated decks, and cosmic guidance — one card at a time.",
  keywords: ["tarot", "tarot reading", "tarot decks", "oracle cards", "cosmic guidance", "тарот", "уншлага"],
  openGraph: {
    title: "The Path of Stars — Tarot Readings & Decks",
    description: "Discover the wisdom hidden in the stars. Tarot readings, curated decks, and cosmic guidance.",
    url: "https://thepathsofstars.com",
    siteName: "The Path of Stars",
    type: "website",
  },
  verification: {
    google: "ehYFUokbCEtCIDXiadCcjbQ_aQukVxtqiv5l8WxQ7ak",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-main)" }}>
        <ThemeProvider>
        <LanguageProvider>
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>

          <footer style={{ borderTop: "1px solid var(--border)" }} className="py-8 mt-16">
            <div className="max-w-300 mx-auto px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">
                ✦ The Path of Stars
              </span>
              <span style={{ color: "var(--text-secondary)" }} className="text-xs">
                © 2025 All rights reserved
              </span>
            </div>
          </footer>
        </CartProvider>
        </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
