import type { Metadata } from "next";

export function buildMetadata(
  title: string,
  description: string,
  image: string = "/og-default.png"
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "GPTiti",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
