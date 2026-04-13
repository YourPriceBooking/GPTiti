"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isTopUpTokensPage = pathname === "/top-up-your-tokens";

  return (
    <>
      <main className={isHomePage ? "h-screen overflow-hidden" : ""}>
        {children}
      </main>

      {!isHomePage && !isTopUpTokensPage && (
        <footer className="text-center text-gray-500 text-sm mt-16 space-y-2 p-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <Link href="/our-mission" className="hover:text-gray-700">
              Our Mission
            </Link>
            <Link href="/terms-conditions" className="hover:text-gray-700">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/sign-in" className="hover:text-gray-700">
              Sign in
            </Link>
            <Link href="/trust" className="hover:text-gray-700">
              Trust & Safety
            </Link>
          </nav>
          <p>
            © {new Date().getFullYear()} Your Price Booking OÜ. All rights
            reserved. GPTiti™ is a trademark of Your Price Booking OÜ.
          </p>
        </footer>
      )}
    </>
  );
}
