import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPTiti – Free AI Models",
  description: "Use GPT-5.1, GPT-4o, o-series for free",
};

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
        <main>{children}</main>

        {/* 🔥 Глобальний footer */}
        <footer className="text-center text-gray-500 text-sm mt-16 space-y-2 p-6">
          <nav className="flex justify-center gap-6">
            <a href="#" className="hover:text-gray-700">Our Mission</a>
            <a href="#" className="hover:text-gray-700">Terms & Conditions</a>
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          </nav>
          <p>© 2025 Your Price Booking. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}