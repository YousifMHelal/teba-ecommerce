import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Providers from "@/components/shared/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
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
      className={`${cairo.className} ${cairo.variable} antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
