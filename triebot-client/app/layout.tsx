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
  title: "Triebot - The Word Robot",
  description: "Can you beat the word robot?",
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
