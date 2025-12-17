"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isTopUpTokensPage = pathname === "/top-up-your-tokens";

  return (
    <>
      <main>{children}</main>

      {!isHomePage && !isTopUpTokensPage && (
        <footer className="text-center text-gray-500 text-sm mt-16 space-y-2 p-6">
          <nav className="flex justify-center gap-6">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <Link href="/our-mission" className="hover:text-gray-700">Our Mission</Link>
            <Link href="/terms-conditions" className="hover:text-gray-700">Terms & Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-gray-700">Privacy Policy</Link>
            <Link href="/sign-in" className="hover:text-gray-700">Sign in</Link>
          </nav>
          <p>© 2025 Your Price Booking. All rights reserved.</p>
        </footer>
      )}
    </>
  );
}