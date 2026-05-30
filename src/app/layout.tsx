import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HeidalAI — Smart Document Chat",
  description:
    "WhatsApp-style AI chat application for querying your business documents. Upload PDFs, Excel files, and CSVs to get instant, AI-powered answers.",
  keywords: [
    "AI chat",
    "document search",
    "RAG",
    "business intelligence",
    "product catalog",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
