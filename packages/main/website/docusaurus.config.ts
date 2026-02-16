import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkCustomEmoji from "./plugins/remark-custom-emoji";
import seoValidatorPlugin from "./plugins/seo-validator";
import pithosPackageJson from "../../pithos/package.json";

const languages: string[] = ["en"]; //["en", "fr"];

/**
 * Empty Prism theme - we'll use CSS variables for all colors.
 * This allows us to customize colors via CSS variables in custom.css
 * See: https://github.com/FormidableLabs/prism-react-renderer#providing-a-css-based-theme
 */
const emptyPrismTheme = { plain: {}, styles: [] };

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Pithos",
  tagline:
    "Everything you need. Nothing you don't. Zero dependencies. 100% TypeScript.",
  favicon: "img/favicon.ico",

  markdown: {
    format: "mdx",
    mermaid: true,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    // v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  headTags: [
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Pithos",
        url: "https://pithos.dev",
        logo: "https://pithos.dev/img/logos/logo.svg",
        description:
          "TypeScript utilities library with zero dependencies. Includes Arkhe (Lodash alternative), Kanon (Zod alternative), Zygos (Neverthrow alternative), Sphalma, and Taphos.",
        sameAs: [
          "https://github.com/mopi1402/pithos",
          `https://www.npmjs.com/package/${pithosPackageJson.name}`,
        ],
      }),
    },
  ],

  // Set the production url of your site here
  url: process.env.SITE_URL || "https://pithos.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mopi1402", // Usually your GitHub org/user name.
  projectName: "pithos", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  onBrokenAnchors: "warn",
  onDuplicateRoutes: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: languages,
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          path: "./docs",
          routeBasePath: "guide",
          sidebarCollapsed: true,
          remarkPlugins: [remarkCustomEmoji],
        },
        sitemap: {
          ignorePatterns: ["/tags/**", "/search"],
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "../documentation/_generated/final",
        routeBasePath: "api",
        sidebarPath: "./sidebarsApi.ts",
        remarkPlugins: [remarkCustomEmoji],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "comparisons",
        path: "./comparisons",
        routeBasePath: "comparisons",
        sidebarPath: "./sidebarsComparisons.ts",
        remarkPlugins: [remarkCustomEmoji],
      },
    ],
    // Exclude client-only modules from SSR bundle
    function () {
      return {
        name: "webpack-ssr-externals",
        configureWebpack(_config, isServer) {
          if (isServer) {
            return {
              externals: {
                "@xenova/transformers": "commonjs @xenova/transformers",
                sharp: "commonjs sharp",
              },
            };
          }
          return {};
        },
      };
    },
    // SEO validation plugin - validates frontmatter, headings, links, keyword stuffing
    [
      seoValidatorPlugin,
      {
        contentDirs: ["docs", "comparisons", "../documentation/_generated/final"],
        minDescriptionLength: 50,
        maxDescriptionLength: 160,
        minInternalLinks: 2,
        maxInternalLinks: 30,
        keywordStuffingThreshold: 0.03,
        failOnError: false,
        excludePatterns: ["_category_.json", "index.md", "changelog.md"],
        keywordStuffingIgnore: ["pithos", "arkhe", "kanon", "zygos", "sphalma", "taphos"],
      },
    ],
  ],

  themes: ["@docusaurus/theme-mermaid"],
  themeConfig: {
    image: "img/pithos-social-card.jpg",
    metadata: [
      {
        name: "keywords",
        content:
          "typescript, utilities, zero dependencies, lodash alternative, zod alternative, neverthrow alternative, tree-shakable, type-safe",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      {
        name: "robots",
        content: "max-snippet:-1, max-image-preview:large",
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    tabs: {
      groupIds: {
        "package-managers": ["npm", "pnpm", "yarn", "bun"],
      },
    },
    navbar: {
      title: "Pithos",
      logo: {
        alt: "",
        src: "img/logos/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          type: "docSidebar",
          docsPluginId: "api",
          sidebarId: "apiSidebar",
          position: "left",
          label: "API Reference",
        },
        {
          to: "/use-cases",
          position: "left",
          label: "Use Cases",
        },
        {
          type: "docSidebar",
          docsPluginId: "comparisons",
          sidebarId: "comparisonsSidebar",
          position: "left",
          label: "Comparisons",
        },
        {
          href: `https://www.npmjs.com/package/${pithosPackageJson.name}`,
          "aria-label": "npm",
          position: "right",
          className: "header-npm-link",
        },
        {
          href: "https://github.com/mopi1402/pithos",
          label: "GitHub",
          position: "right",
          className: "header-github-link",
        },
        ...(languages.length > 1
          ? [
              {
                type: "localeDropdown" as const,
                position: "right" as const,
              },
            ]
          : []),
      ],
    },
    footer: {
      style: "dark",
      copyright: `<span class="footer__main">© ${new Date().getFullYear()} <a href="https://www.linkedin.com/in/mopi1402/" target="_blank" rel="noopener noreferrer">Pierre Moati</a> · <a href="https://github.com/mopi1402/pithos/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a> · <a href="/guide/basics/changelog/">Changelog</a></span><span class="footer__dot"> · </span><span class="footer__docusaurus" style="opacity: 0.7;">Website built with <a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer" style="color: hsl(167, 68%, 45%);">Docusaurus</a> <img src="/img/external/docusaurus_logo.svg" alt="" /></span>`,
    },
    prism: {
      // Using empty theme - colors are defined via CSS variables in custom.css
      theme: emptyPrismTheme,
      darkTheme: emptyPrismTheme,
      additionalLanguages: ["typescript", "javascript", "bash"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
