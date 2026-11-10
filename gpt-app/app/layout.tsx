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
  "GPTiti — AI Chat for Writing, Coding & Analysis",
  "Chat with GPT-5.4-mini, GPT-5.4, and GPT-5.5 on GPTiti. Get help with writing, coding, and analysis without a monthly subscription.",
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
