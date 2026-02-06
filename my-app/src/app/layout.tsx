import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Gym Attendance",
  description: "A cloud-powered gym attendance system with AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8">
            <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors">
              QR Gym Attendance
            </Link>
            <span className="text-xs text-zinc-500">Frontend Demo</span>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
