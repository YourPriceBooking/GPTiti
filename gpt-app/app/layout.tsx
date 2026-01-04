import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; 
import { TokensProvider } from "@/context/TokensContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GPTiti – Free AI Models",
  description: "Use GPT-5.1, GPT-4o, o-series for free",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <GoogleOAuthProvider clientId="208320907418-1nlduimdeu6d0cbvausroj0hqhit91gh.apps.googleusercontent.com">
        <TokensProvider>
        <ClientLayout>{children}</ClientLayout>
        </TokensProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}