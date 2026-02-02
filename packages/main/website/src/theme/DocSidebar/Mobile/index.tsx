import React from "react";
import clsx from "clsx";
import {
  NavbarSecondaryMenuFiller,
  type NavbarSecondaryMenuComponent,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { useActivePlugin } from "@docusaurus/plugin-content-docs/client";
import DocSidebarItems from "@theme/DocSidebarItems";
import { SidebarFilterProvider } from "@site/src/contexts/SidebarFilterContext";
import SidebarTopbarFilter from "@site/src/components/SidebarTopbarFilter";
import { SIDEBAR_CONFIG } from "@site/src/config/sidebar";
import type { Props } from "@theme/DocSidebar/Mobile";

const DocSidebarMobileSecondaryMenu: NavbarSecondaryMenuComponent<Props> = ({
  sidebar,
  path,
}) => {
  const mobileSidebar = useNavbarMobileSidebar();
  const activePlugin = useActivePlugin();
  const isApiReference =
    activePlugin?.pluginId === SIDEBAR_CONFIG.API_PLUGIN_ID;

  return (
    <SidebarFilterProvider>
      {isApiReference && <SidebarTopbarFilter />}
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, "menu__list")}>
        <DocSidebarItems
          items={sidebar}
          activePath={path}
          onItemClick={(item) => {
            // Mobile sidebar should only be closed if the category has a link
            if (item.type === "category" && item.href) {
              mobileSidebar.toggle();
            }
            if (item.type === "link") {
              mobileSidebar.toggle();
            }
          }}
          level={1}
        />
      </ul>
    </SidebarFilterProvider>
  );
};

function DocSidebarMobile(props: Props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
