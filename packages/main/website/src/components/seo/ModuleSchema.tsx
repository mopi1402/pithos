import React from "react";
import Head from "@docusaurus/Head";
import packageJson from "../../../../../../package.json";

interface ModuleSchemaProps {
  name: string;
  description: string;
  url: string;
}

/**
 * Schema.org SoftwareApplication JSON-LD for module pages
 */
export function ModuleSchema({ name, description, url }: ModuleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    programmingLanguage: "TypeScript",
    codeRepository: "https://github.com/mopi1402/pithos",
    license: "https://opensource.org/licenses/MIT",
    description,
    url,
    softwareVersion: packageJson.version,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Pierre Moati",
      url: "https://www.linkedin.com/in/mopi1402/",
    },
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
