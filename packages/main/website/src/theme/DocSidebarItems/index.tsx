import React, {memo, type ReactNode, useMemo} from 'react';
import {
  DocSidebarItemsExpandedStateProvider,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import DocSidebarItem from '@theme/DocSidebarItem';
import {useSidebarFilter} from '@site/src/contexts/SidebarFilterContext';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

import type {Props} from '@theme/DocSidebarItems';

function isItemImportant(item: PropSidebarItem): boolean {
  if ('customProps' in item && item.customProps) {
    const customProps = item.customProps as {
      important?: boolean;
      hiddenGem?: boolean;
    };
    return customProps?.important === true;
  }
  return false;
}

function isItemHiddenGem(item: PropSidebarItem): boolean {
  if ('customProps' in item && item.customProps) {
    const customProps = item.customProps as {
      important?: boolean;
      hiddenGem?: boolean;
    };
    return customProps?.hiddenGem === true;
  }
  return false;
}

function filterSidebarItems(
  items: PropSidebarItem[],
  showTopPicksOnly: boolean,
  showHiddenGemsOnly: boolean
): PropSidebarItem[] {
  if (!showTopPicksOnly && !showHiddenGemsOnly) {
    return items;
  }

  return items
    .map((item) => {
      if (item.type === 'category') {
        // Check if category itself matches filters
        const categoryMatches =
          (showTopPicksOnly && isItemImportant(item)) ||
          (showHiddenGemsOnly && isItemHiddenGem(item));
        const filteredItems = filterSidebarItems(
          item.items,
          showTopPicksOnly,
          showHiddenGemsOnly
        );
        // Keep category if it matches filters or if it has matching items
        if (categoryMatches || filteredItems.length > 0) {
          return {
            ...item,
            items: filteredItems,
          };
        }
        return null;
      }
      // For doc and link items, check if they match any active filter
      const matchesTopPicks = showTopPicksOnly && isItemImportant(item);
      const matchesHiddenGems = showHiddenGemsOnly && isItemHiddenGem(item);
      if (matchesTopPicks || matchesHiddenGems) {
        return item;
      }
      return null;
    })
    .filter((item): item is PropSidebarItem => item !== null);
}

function DocSidebarItems({items, ...props}: Props): ReactNode {
  const visibleItems = useVisibleSidebarItems(items, props.activePath);
  const {showTopPicksOnly, showHiddenGemsOnly} = useSidebarFilter();
  
  const filteredItems = useMemo(
    () => filterSidebarItems(visibleItems, showTopPicksOnly, showHiddenGemsOnly),
    [visibleItems, showTopPicksOnly, showHiddenGemsOnly]
  );
  
  return (
    <DocSidebarItemsExpandedStateProvider>
      {filteredItems.map((item, index) => (
        <DocSidebarItem key={index} item={item} index={index} {...props} />
      ))}
    </DocSidebarItemsExpandedStateProvider>
  );
}

// Optimize sidebar at each "level"
export default memo(DocSidebarItems);
