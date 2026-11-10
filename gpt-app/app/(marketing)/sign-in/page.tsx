import { buildMetadata } from "@/lib/metadata";
import SignIn from "@/components/SignIn/SignIn";

export const metadata = buildMetadata(
  "GPT-5.4-mini, GPT-5.4 & GPT-5.5 Without a Subscription – GPTiti",
  "Use GPT-5.4-mini, GPT-5.4, and GPT-5.5 on GPTiti. Start with free tokens and pay for usage without a monthly subscription.",
);

export default function SignInPage() {
  return <SignIn />;
}
