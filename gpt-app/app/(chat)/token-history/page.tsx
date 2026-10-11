import type { Metadata } from "next";
import TokenHistoryPage from "@/components/TokenHistoryPage/TokenHistoryPage";

export const metadata: Metadata = {
  title: "Token history | GPTiti",
  description: "Your account balance and token activity on GPTiti.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TokenHistoryPage />;
}
