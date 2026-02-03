import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

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

  // Set the production url of your site here
  url: "https://pithos.dev",
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
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/api",
            to: "/api/arkhe/",
          },
        ],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "../documentation/_generated/final",
        routeBasePath: "api",
        sidebarPath: "./sidebarsApi.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "comparisons",
        path: "./comparisons",
        routeBasePath: "comparisons",
        sidebarPath: "./sidebarsComparisons.ts",
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
  ],

  themes: ["@docusaurus/theme-mermaid"],
  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    tabs: {
      groupIds: {
        "package-managers": ["npm", "pnpm", "yarn"],
      },
    },
    navbar: {
      title: "Pithos",
      logo: {
        alt: "Pithos",
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
          href: "https://github.com/mopi1402/pithos",
          label: "GitHub",
          position: "right",
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
      copyright: `© ${new Date().getFullYear()} <a href="https://www.linkedin.com/in/mopi1402/" target="_blank" rel="noopener noreferrer">Pierre Moati</a> · <a href="https://github.com/mopi1402/pithos/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a> · <a href="/guide/basics/changelog/">Changelog</a>`,
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
