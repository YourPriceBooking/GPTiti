

import React from "react";
import Head from "next/head";
import OurMission from "./OurMission";


export default function OurMissionPage() {
  return (
    <>
      <Head>
        <title>Our Mission | GPtiti — Free Access to Advanced AI Models</title>
        <meta
          name="description"
          content="GPtiti brings all advanced AI models into one place and gives everyone free access without subscriptions. Our mission is global, open AI for every human."
        />
        <meta property="og:title" content="Our Mission | GPtiti" />
        <meta
          property="og:description"
          content="Discover GPtiti's mission — global access to the most powerful AI models without subscriptions or limits."
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
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
      </Head>
    <OurMission />
</>
  );
}