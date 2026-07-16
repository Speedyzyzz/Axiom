import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" className={`${inter.variable} ${jbMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
