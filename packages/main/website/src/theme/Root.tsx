import React from "react";
import { useLocation } from "@docusaurus/router";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

/**
 * Root theme component wrapper that injects Schema.org BreadcrumbList
 * on all pages based on the current route.
 *
 * This component wraps the entire application and adds breadcrumb structured data
 * to help search engines understand the site hierarchy.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();

  // Generate breadcrumb schema based on current path
  const breadcrumbSchema = React.useMemo(() => {
    const pathname = location.pathname;

    // Skip homepage
    if (pathname === "/") {
      return null;
    }

    // Generate breadcrumb items
    const items = generateBreadcrumbItems(pathname, siteConfig.url);

    // Only add breadcrumb schema if there are at least 2 items
    if (items.length < 2) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  }, [location.pathname, siteConfig.url]);

  return (
    <>
      {breadcrumbSchema && (
        <Head>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema, null, 0)}
          </script>
        </Head>
      )}
      {children}
    </>
  );
}

/**
 * Generate breadcrumb items from a pathname
 */
function generateBreadcrumbItems(
  pathname: string,
  baseUrl: string
): Array<{
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}> {
  // Remove leading and trailing slashes, then split
  const pathSegments = pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);

  // Always start with homepage
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  // Build breadcrumb items from path segments
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert segment to readable name
    let name = formatSegmentName(segment);
    
    // Ensure name is a valid string (not a function or undefined)
    if (typeof name !== "string" || name.length === 0) {
      name = segment;
    }
    
    // Additional safety check for reserved JavaScript property names
    if (typeof name === "function" || name.includes("[native code]")) {
      name = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    // Explicitly create the item object to avoid any property name conflicts
    const item = {
      "@type": "ListItem" as const,
      position: index + 2, // +2 because position 1 is home
      name: name,
      item: `${baseUrl}${currentPath}/`,
    };

    items.push(item);
  });

  return items;
}

/**
 * Format a URL segment into a readable breadcrumb name
 */
function formatSegmentName(segment: string): string {
  // Handle empty or invalid segments
  if (!segment || typeof segment !== "string") {
    return "Page";
  }

  // Special cases for known segments
  const specialCases: Record<string, string> = {
    guide: "Documentation",
    api: "API Reference",
    comparisons: "Comparisons",
    modules: "Modules",
    arkhe: "Arkhe",
    kanon: "Kanon",
    zygos: "Zygos",
    sphalma: "Sphalma",
    taphos: "Taphos",
    basics: "Basics",
    contribution: "Contribution",
    "get-started": "Get Started",
    "use-cases": "Use Cases",
    lang: "Lang",
    // Handle JavaScript reserved property names
    toString: "ToString",
    valueOf: "ValueOf",
    constructor: "Constructor",
    hasOwnProperty: "HasOwnProperty",
  };

  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Default: capitalize first letter of each word, replace hyphens with spaces
  const formatted = segment
    .split("-")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .filter(Boolean)
    .join(" ");

  // Fallback to capitalized segment if formatting resulted in empty string
  return formatted || (segment.charAt(0).toUpperCase() + segment.slice(1));
}
