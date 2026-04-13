import React from "react";
import { buildMetadata } from "@/lib/metadata";
import OurMission from "./OurMission";

export const metadata = buildMetadata(
  "Our Mission | GPtiti — Free Access to Advanced AI Models",
  "GPtiti brings all advanced AI models into one place and gives everyone free access without subscriptions. Our mission is global, open AI for every human."
);

export default function OurMissionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Our Mission | GPtiti",
            description:
              "GPtiti brings all advanced AI models into one place and gives everyone free access without subscriptions.",
            url: "https://gptiti.com/our-mission",
            publisher: {
              "@type": "Organization",
              name: "GPtiti",
              url: "https://gptiti.com",
            },
          }),
        }}
      />
      <OurMission />
    </>
  );
}
