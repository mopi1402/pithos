import type { ReactNode } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import packageJson from "../../../../../../pithos/package.json";

const pkg = packageJson.name;

/**
 * Centralized install command tabs.
 * Reads the package name from packages/pithos/package.json so it stays in sync.
 */
export function InstallTabs(): ReactNode {
  return (
    <Tabs groupId="package-managers">
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="bash">{`npm install ${pkg}`}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="bash">{`pnpm install ${pkg}`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="bash">{`yarn add ${pkg}`}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="bun">
        <CodeBlock language="bash">{`bun add ${pkg}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
