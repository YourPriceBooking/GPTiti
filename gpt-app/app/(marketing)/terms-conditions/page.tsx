import { buildMetadata } from "@/lib/metadata";
import TermsConditions from "@/components/TermsConditions/TermsConditions";

export const metadata = buildMetadata(
  "Terms and Conditions | GPTiti — Usage Rules & Token Policy",
  "Read GPTiti Terms and Conditions to understand usage rules, token system, payments, and limitations. No subscriptions, transparent pricing, and full control.",
);

export default function TermsPage() {
  return <TermsConditions />;
}
