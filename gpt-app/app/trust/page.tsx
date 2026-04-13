import React from "react";
import { buildMetadata } from "@/lib/metadata";
import TrustSafety from "@/components/TrustSafety/TrustSafety";

export const metadata = buildMetadata(
  "Trust & Safety | GPTiti — Secure AI Access Without Subscriptions",
  "Learn how GPTiti protects your data, ensures secure payments, and provides transparent AI access. No subscriptions, no cookies tracking, full control over your usage."
);

export default function TrustAndSafetyPage() {
  return (
    <>
      <TrustSafety />
    </>
  );
}
