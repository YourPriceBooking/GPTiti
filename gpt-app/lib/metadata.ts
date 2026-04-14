import type { Metadata } from "next";

const SITE_URL = "https://ypbooking.chost.com.ua";

export function buildMetadata(title: string, description: string): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "GPTiti",
      type: "website",
      url: SITE_URL,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
