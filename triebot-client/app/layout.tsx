import type { Metadata } from "next";
import { Google_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triebot",
  description: "The word bot that almost never loses",
  openGraph: {
    title: "Triebot",
    description: "The word bot that almost never loses",
    url: "https://triebot.faddal.dev",
    siteName: "Triebot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Triebot - A ghost game bot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Triebot - The Word Robot",
    description: "Triebot...a ghost game bot",
    images: ["/og-image.png"],
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
        className={`${googleSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster theme="dark" position="top-center" duration={2000} closeButton />
        {children}
      </body>
    </html>
  );
}
