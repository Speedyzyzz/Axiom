import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // Explicitly loading the weights requested
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AttackChain AI - Secure Financial Intelligence",
  description: "Enterprise SOC Investigation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
