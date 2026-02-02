import React from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useActivePlugin } from "@docusaurus/plugin-content-docs/client";
import Logo from "@theme/Logo";
import CollapseButton from "@theme/DocSidebar/Desktop/CollapseButton";
import Content from "@theme/DocSidebar/Desktop/Content";
import { SidebarFilterProvider } from "@site/src/contexts/SidebarFilterContext";
import SidebarTopbarFilter from "@site/src/components/SidebarTopbarFilter";
import { SIDEBAR_CONFIG } from "@site/src/config/sidebar";
import type { Props } from "@theme/DocSidebar/Desktop";

import styles from "./styles.module.css";

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props) {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();

  const activePlugin = useActivePlugin();
  const isApiReference =
    activePlugin?.pluginId === SIDEBAR_CONFIG.API_PLUGIN_ID;

  return (
    <SidebarFilterProvider>
      <div
        className={clsx(
          styles.sidebar,
          hideOnScroll && styles.sidebarWithHideableNavbar,
          isHidden && styles.sidebarHidden
        )}
      >
        {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
        {isApiReference && <SidebarTopbarFilter />}
        <Content path={path} sidebar={sidebar} />
        {hideable && <CollapseButton onClick={onCollapse} />}
      </div>
    </SidebarFilterProvider>
  );
}

export default React.memo(DocSidebarDesktop);
