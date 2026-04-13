import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import TrustSafety from "@/components/TrustSafety/TrustSafety";

export const metadata = buildMetadata(
  "Trust & Safety | GPTiti — Secure AI Access Without Subscriptions",
  "Learn how GPTiti protects your data, ensures secure payments, and provides transparent AI access. No subscriptions, no cookies tracking, full control over your usage."
);

export default function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-slate-100 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-blue-600 font-medium hover:underline">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <img src="/icons/rabbit.svg" alt="logo" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">
              GPT<span className="text-blue-600">iti</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <TrustSafety />
      </div>
    </div>
  );
}