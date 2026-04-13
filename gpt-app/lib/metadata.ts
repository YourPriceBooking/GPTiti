import type { Metadata } from "next";

const SITE_URL = "https://ypbooking.chost.com.ua";

export function buildMetadata(
  title: string,
  description: string,
  image: string = "/og-default.png"
): Metadata {
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
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
