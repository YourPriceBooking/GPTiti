import { Geist, Geist_Mono } from "next/font/google";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; 
import { TokensProvider } from "@/context/TokensContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { WsProvider } from "@/context/WsContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = buildMetadata(
  "GPTiti – Free AI Models",
  "Use GPT-5.1, GPT-4o, o-series for free"
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
           <AuthProvider>
             <SocketProvider>
              <WsProvider>
              <TokensProvider>
                <ChatProvider>
                  <ClientLayout>{children}</ClientLayout>
                </ChatProvider>
              </TokensProvider>
              </WsProvider>
             </SocketProvider>
           </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}