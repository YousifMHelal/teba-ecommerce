import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import Providers from "@/components/shared/Providers";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teba",
  description: "Teba is a modern single-vendor e-commerce storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${inter.variable} font-sans antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(24,24,27,0.08),transparent_28%),linear-gradient(180deg,#faf7f2_0%,#fffefc_40%,#f7f3ee_100%)] text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
