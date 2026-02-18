import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investo - Open Source ETF Investment Tracker",
  description:
    "Track your ETF investments with comprehensive metrics. No account required, all data stored locally in your browser. Free and open source.",
  keywords: [
    "ETF",
    "investment",
    "tracker",
    "portfolio",
    "stocks",
    "finance",
    "open source",
  ],
  authors: [{ name: "Investo Contributors" }],
  openGraph: {
    title: "Investo - Open Source ETF Investment Tracker",
    description:
      "Track your ETF investments with comprehensive metrics. No account required.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investo - Open Source ETF Investment Tracker",
    description:
      "Track your ETF investments with comprehensive metrics. No account required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-zinc-950`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
