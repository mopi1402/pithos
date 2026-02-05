import type { ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import NotFoundContent from "./Content";

export default function NotFound(): ReactNode {
  return (
    <>
      <PageMetadata
        title={translate({ id: 'theme.NotFound.meta.title', message: 'Page Not Found' })}
        description={translate({ id: 'theme.NotFound.meta.description', message: 'The page you are looking for does not exist.' })}
      />
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
}
