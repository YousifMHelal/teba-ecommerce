import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { Providers } from "@/components/shared/Providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      lang="en"
      className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(24,24,27,0.08),_transparent_28%),linear-gradient(180deg,_#faf7f2_0%,_#fffefc_40%,_#f7f3ee_100%)] text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
