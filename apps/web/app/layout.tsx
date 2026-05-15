import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AppToaster } from "@/providers/app-toaster";
import { getAppUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: "Looma",
  description: "Replay-native review layer for autonomous coding agents.",
  openGraph: {
    title: "Looma",
    description: "Replay-native review layer for autonomous coding agents.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looma",
    description: "Replay-native review layer for autonomous coding agents.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <AppToaster />
      </body>
    </html>
  );
}
