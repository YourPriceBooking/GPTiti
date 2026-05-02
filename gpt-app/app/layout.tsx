import { Geist, Geist_Mono } from "next/font/google";

import { buildMetadata } from "@/lib/metadata";

import Providers from "./providers";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = buildMetadata(
  "GPTiti — AI Chat, Image Generator & API-Powered Tools",
  "AI tools powered by direct API access to premium GPT models. Chat, create images, convert voice, and search your data instantly with GPTiti.",
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
