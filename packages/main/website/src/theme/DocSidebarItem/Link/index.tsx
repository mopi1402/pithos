import { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/DocSidebarItem/Link";

import styles from "./styles.module.css";

function LinkLabel({ label }: { label: string }) {
  return (
    <span title={label} className={styles.linkLabel}>
      {label}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  ...props
}: Props): ReactNode {
  const { href, label, className, autoAddBaseUrl } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  // Check if the item has customProps with important or hiddenGem flag
  // sidebar_custom_props in front matter is accessible via item.customProps
  const customProps =
    "customProps" in item
      ? (item as {
          customProps?: { important?: boolean; hiddenGem?: boolean };
        }).customProps
      : null;
  const isImportant = customProps?.important === true;
  const isHiddenGem = customProps?.hiddenGem === true;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        "menu__list-item",
        className
      )}
      key={label}
    >
      <Link
        className={clsx(
          "menu__link",
          !isInternalLink && styles.menuExternalLink,
          {
            "menu__link--active": isActive,
          }
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? "page" : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
      >
        <LinkLabel label={label} />
        {isImportant && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: "0.5rem",
              fontSize: "0.875rem",
            }}
            title="Top pick"
          >
            👑
          </span>
        )}
        {isHiddenGem && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: "0.5rem",
              fontSize: "0.875rem",
            }}
            title="Hidden gem"
          >
            💎
          </span>
        )}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
