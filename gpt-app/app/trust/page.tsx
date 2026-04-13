import React from "react";
import type { Metadata } from "next";
import TrustSafety from "@/components/TrustSafety/TrustSafety";

export const metadata: Metadata = {
  title: "Trust & Safety | GPTiti — Secure AI Access Without Subscriptions",
  description:
    "Learn how GPTiti protects your data, ensures secure payments, and provides transparent AI access. No subscriptions, no cookies tracking, full control over your usage.",
};

export default function TrustAndSafetyPage() {
  return (
    <>
      <TrustSafety />
    </>
  );
}
