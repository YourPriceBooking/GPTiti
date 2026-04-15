import { buildMetadata } from "@/lib/metadata";
import SignIn from "../../components/SignIn/SignIn";

export const metadata = buildMetadata(
  "GPT-5.1, GPT-4o, o1 Without ChatGPT Plus – GPTiti (Free Start)",
  "GPTiti = all OpenAI models (GPT-5.1, 4o, o1, o3) without paying $20/month.",
);

export default function SignInPage() {
  return <SignIn />;
}
