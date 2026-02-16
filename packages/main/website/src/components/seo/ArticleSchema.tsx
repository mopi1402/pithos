import React from "react";
import Head from "@docusaurus/Head";

interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
}

/**
 * Schema.org Article JSON-LD for comparison and editorial pages.
 */
export function ArticleSchema({
  headline,
  description,
  datePublished,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    author: {
      "@type": "Person",
      name: "Pierre Moati",
      url: "https://www.linkedin.com/in/mopi1402/",
    },
    publisher: {
      "@type": "Organization",
      name: "Pithos",
      logo: {
        "@type": "ImageObject",
        url: "https://pithos.dev/img/logos/logo.svg",
      },
    },
    mainEntityOfPage: typeof window !== "undefined" ? window.location.href : undefined,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
