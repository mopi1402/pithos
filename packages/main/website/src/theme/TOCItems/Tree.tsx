import React, {type ReactNode, useRef, useEffect} from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/TOCItems/Tree';
import {EMOJI_MAP} from '../../../plugins/emoji-map';

const EMOJI_KEYS = Object.keys(EMOJI_MAP);
const EMOJI_PATTERN = new RegExp(
  '(' + EMOJI_KEYS.map((e) => e.replace(/[-\/\\^$*+?.()|[\]{}]/g, (ch) => '\\' + ch)).join('|') + ')',
  'g',
);

function extractEmoji(html: string): {emoji: string | null; text: string} {
  EMOJI_PATTERN.lastIndex = 0;
  const match = EMOJI_PATTERN.exec(html);
  if (!match) return {emoji: null, text: html};
  return {emoji: match[0], text: html.replace(match[0], '').trim()};
}

function emojiImg(emoji: string): string {
  const {src, alt, id} = EMOJI_MAP[emoji]!;
  const cn = id ?? alt;
  const cls = cn ? `custom-emoji custom-emoji--${cn}` : 'custom-emoji';
  return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy" decoding="async" />`;
}

function replaceEmojis(html: string): string {
  return html.replace(EMOJI_PATTERN, (m) => emojiImg(m));
}

const ACTIVE_CLS = 'table-of-contents__link--active';
const SLIDER_CLS = 'toc-timeline__slider';
const ITEM_ACTIVE = 'toc-timeline__item--active';
/** Pixel offset to align the floating clone with the real TOC item */
const FLOAT_OFFSET_X = 0;
const FLOAT_OFFSET_Y = 8;

function useSlider(rootRef: React.RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let slider: HTMLSpanElement | null = null;
    let prevActive: Element | null = null;
    let prevLi: Element | null = null;
    let rafId = 0;
    let firstTick = true;
    let wasAllActive = false;

    // Mark TOC items that correspond to merged-type headings (as-h1 in the page)
    const SECTION_TITLE_CLS = 'toc-timeline__item--section-title';
    root.querySelectorAll(':scope > .toc-timeline__item').forEach(li => {
      const link = li.querySelector('.toc-timeline__link') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      const targetId = href.replace('#', '');
      const heading = document.getElementById(targetId);
      if (heading?.closest('.as-h1')) {
        li.classList.add(SECTION_TITLE_CLS);
      }
    });

    function ensureSlider() {
      if (!slider) {
        slider = document.createElement('li') as unknown as HTMLSpanElement;
        slider.className = SLIDER_CLS;
        slider.setAttribute('role', 'presentation');
        slider.setAttribute('aria-hidden', 'true');
        root!.prepend(slider);
      }
      return slider;
    }

    // Recalculate slider position based on current prevLi
    function updateSliderPosition() {
      if (!slider || !prevLi) return;
      const li = prevLi as HTMLElement;
      const row = li.querySelector('.toc-timeline__row') as HTMLElement;
      if (!row) return;

      // If this is a section title (item right after a parent separator), hide slider
      const prevSibling = li.previousElementSibling;
      if (!li.closest('.toc-timeline__children') && li.classList.contains(SECTION_TITLE_CLS)) {
        slider.style.opacity = '0';
        return;
      }

      const parentLi = li.closest('.toc-timeline__children')?.closest('.toc-timeline__item') as HTMLElement | null;
      const parentRow = parentLi?.querySelector(':scope > .toc-timeline__row') as HTMLElement | null;
      const startRow = parentRow ?? row;
      const endRow = row;

      // Walk offsetParent to get position relative to root ul (position: relative)
      function topRelativeToRoot(el: HTMLElement): number {
        let t = 0;
        let cur: HTMLElement | null = el;
        while (cur && cur !== root) {
          t += cur.offsetTop;
          cur = cur.offsetParent as HTMLElement | null;
        }
        return t;
      }

      const sliderTop = topRelativeToRoot(startRow) + startRow.offsetHeight / 2;
      const sliderBottom = topRelativeToRoot(endRow) + endRow.offsetHeight / 2;

      const items = root!.querySelectorAll(':scope > .toc-timeline__item');
      const topLevelLi = parentLi ?? li;
      const isFirst = topLevelLi === items[0];
      const isLast = topLevelLi === items[items.length - 1] && !parentLi;

      slider.style.top = `${sliderTop}px`;
      slider.style.height = `${Math.max(0, sliderBottom - sliderTop)}px`;
      slider.style.opacity = '1';
      slider.classList.toggle('toc-timeline__slider--first', isFirst);
      slider.classList.toggle('toc-timeline__slider--last', isLast);
    }

    // Floating parent header clone
    let floatingClone: HTMLElement | null = null;
    let floatingTarget: HTMLElement | null = null; // track which li the clone was built for
    // Find the scrollable TOC container
    function findScrollableParent(el: HTMLElement): HTMLElement | null {
      let cur = el.parentElement;
      while (cur) {
        const style = getComputedStyle(cur);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') return cur;
        cur = cur.parentElement;
      }
      return null;
    }
    const container = findScrollableParent(root!) ?? root!.parentElement;

    function updateFloatingParent() {
      if (!container || !prevLi) {
        if (floatingClone) { floatingClone.remove(); floatingClone = null; floatingTarget = null; }
        return;
      }
      const li = prevLi as HTMLElement;
      
      // Find the parent row to float:
      // - If active item is a child, float its parent
      // - If active item is a parent with children, float itself
      const childParentLi = li.closest('.toc-timeline__children')?.closest('.toc-timeline__item') as HTMLElement | null;
      const isParentWithChildren = li.classList.contains('toc-timeline__item--parent');
      const targetLi = childParentLi ?? (isParentWithChildren ? li : null);
      
      if (!targetLi) {
        if (floatingClone) { floatingClone.remove(); floatingClone = null; floatingTarget = null; }
        return;
      }
      const targetRow = targetLi.querySelector(':scope > .toc-timeline__row') as HTMLElement | null;
      if (!targetRow) return;

      const containerRect = container.getBoundingClientRect();
      const targetRowRect = targetRow.getBoundingClientRect();

      // Target row is above the visible area of the container
      if (targetRowRect.top < containerRect.top) {
        // Recreate clone if target changed
        if (floatingClone && floatingTarget !== targetLi) {
          floatingClone.remove();
          floatingClone = null;
          floatingTarget = null;
        }
        if (!floatingClone) {
          floatingClone = document.createElement('div');
          floatingClone.classList.add('toc-timeline__floating-parent');
          
          // Replicate the full timeline structure so all CSS rules apply
          const innerUl = document.createElement('ul');
          innerUl.className = root!.className; // includes 'toc-timeline' + docusaurus classes
          innerUl.style.margin = '0';
          innerUl.style.padding = '0';
          
          const innerLi = document.createElement('li');
          innerLi.className = targetLi.className;
          if (!innerLi.classList.contains(ITEM_ACTIVE)) {
            innerLi.classList.add(ITEM_ACTIVE);
          }
          
          const rowClone = targetRow.cloneNode(true) as HTMLElement;
          // Remove any active link class from clone (it's the parent, not the active child)
          rowClone.querySelectorAll(`.${ACTIVE_CLS}`).forEach(el => el.classList.remove(ACTIVE_CLS));
          innerLi.appendChild(rowClone);
          innerUl.appendChild(innerLi);
          floatingClone.appendChild(innerUl);
          
          document.body.appendChild(floatingClone);
          floatingTarget = targetLi;
        }

        // Slide-up logic: when the last child row of this parent approaches,
        // push the clone upward progressively (like Table's sticky header).
        const lastChildRow = targetLi.querySelector('.toc-timeline__children .toc-timeline__item:last-child .toc-timeline__row') as HTMLElement | null;
        const bottomBoundaryEl = lastChildRow ?? targetRow;
        const bottomBoundaryRect = bottomBoundaryEl.getBoundingClientRect();
        const cloneHeight = floatingClone.offsetHeight;
        const distFromTop = bottomBoundaryRect.bottom - containerRect.top;

        if (distFromTop < cloneHeight) {
          const pushUp = cloneHeight - distFromTop;
          floatingClone.style.top = `${containerRect.top - pushUp - FLOAT_OFFSET_X}px`;
          floatingClone.style.clipPath = `inset(${pushUp}px 0 0 0)`;
        } else {
          floatingClone.style.top = `${containerRect.top - FLOAT_OFFSET_Y}px`;
          floatingClone.style.clipPath = '';
        }

        // Align horizontally with the real li element
        floatingClone.style.left = `${containerRect.left - FLOAT_OFFSET_X}px`;
        floatingClone.style.width = `${containerRect.width}px`;
      } else {
        if (floatingClone) { floatingClone.remove(); floatingClone = null; floatingTarget = null; }
      }
    }

    // Listen for TOC container scroll to update slider + floating parent
    function onContainerScroll() {
      if (slider) slider.style.transition = 'none';
      updateSliderPosition();
      updateFloatingParent();
    }
    if (container) {
      container.addEventListener('scroll', onContainerScroll, {passive: true});
    }

    function tick() {
      // Page not scrollable: all content visible → highlight every TOC item
      const notScrollable = document.documentElement.scrollHeight <= window.innerHeight + 2;
      if (notScrollable) {
        const allItems = root!.querySelectorAll('.toc-timeline__item');
        allItems.forEach(item => item.classList.add(ITEM_ACTIVE));

        const s = ensureSlider();
        const topItems = root!.querySelectorAll(':scope > .toc-timeline__item');
        const firstRow = (topItems[0]?.querySelector('.toc-timeline__row') ?? topItems[0]) as HTMLElement | undefined;
        const lastRow = (topItems[topItems.length - 1]?.querySelector('.toc-timeline__row') ?? topItems[topItems.length - 1]) as HTMLElement | undefined;
        if (firstRow && lastRow) {
          const rootRect = root!.getBoundingClientRect();
          const fRect = firstRow.getBoundingClientRect();
          const lRect = lastRow.getBoundingClientRect();
          const top = fRect.top - rootRect.top + fRect.height / 2;
          const bottom = lRect.top - rootRect.top + lRect.height / 2;
          s.style.top = `${top}px`;
          s.style.height = `${bottom - top}px`;
          s.style.opacity = '1';
          s.classList.toggle('toc-timeline__slider--first', true);
          s.classList.toggle('toc-timeline__slider--last', true);
        }

        wasAllActive = true;
        firstTick = false;
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Transitioning from all-active back to normal: clean up
      if (wasAllActive) {
        root!.querySelectorAll('.toc-timeline__item').forEach(item => item.classList.remove(ITEM_ACTIVE));
        wasAllActive = false;
        prevLi = null;
        prevActive = null;
      }

      let active = root!.querySelector(`.${ACTIVE_CLS}`);

      // At bottom of page: force last item active
      const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 2);
      if (atBottom) {
        const allLinks = root!.querySelectorAll('.toc-timeline__link');
        const lastLink = allLinks[allLinks.length - 1] ?? null;
        if (lastLink && lastLink !== active) {
          if (active) active.classList.remove(ACTIVE_CLS);
          lastLink.classList.add(ACTIVE_CLS);
          active = lastLink;
        }
      }

      // No active link: force first item active
      if (!active) {
        const firstLink = root!.querySelector('.toc-timeline__link');
        if (firstLink) {
          firstLink.classList.add(ACTIVE_CLS);
          active = firstLink;
        }
      }

      // If active is a section title (merged type heading),
      // redirect to the last link of the previous section
      if (active) {
        const activeLi = active.closest('.toc-timeline__item');
        if (activeLi?.classList.contains(SECTION_TITLE_CLS)) {
          const prevSibling = activeLi.previousElementSibling;
          if (prevSibling) {
            const prevLinks = prevSibling.querySelectorAll('.toc-timeline__link');
            const lastPrevLink = prevLinks[prevLinks.length - 1] ?? null;
            if (lastPrevLink) {
              active.classList.remove(ACTIVE_CLS);
              lastPrevLink.classList.add(ACTIVE_CLS);
              active = lastPrevLink;
            }
          }
        }
      }

      if (active !== prevActive) {
        prevActive = active;
        // Remove previous active classes
        if (prevLi) prevLi.classList.remove(ITEM_ACTIVE);
        root!.querySelectorAll(`.${ITEM_ACTIVE}`).forEach(el => el.classList.remove(ITEM_ACTIVE));

        const li = active?.closest('.toc-timeline__item') ?? null;
        if (li) {
          li.classList.add(ITEM_ACTIVE);

          // Also activate parent item if this is a child
          const parentLi = li.closest('.toc-timeline__children')?.closest('.toc-timeline__item') ?? null;
          if (parentLi) {
            parentLi.classList.add(ITEM_ACTIVE);
          }

          if (!slider) {
            slider = document.createElement('span');
            slider.className = SLIDER_CLS;
            root!.prepend(slider);
          }

          const row = li.querySelector('.toc-timeline__row') as HTMLElement;

          // Auto-scroll TOC container to keep active item visible
          const tocContainer = root!.parentElement;
          if (!firstTick && tocContainer && tocContainer.scrollHeight > tocContainer.clientHeight) {
            const cRect = tocContainer.getBoundingClientRect();
            const scrollTarget = row ?? li;
            const sRect = scrollTarget.getBoundingClientRect();
            if (sRect.top < cRect.top || sRect.bottom > cRect.bottom) {
              const targetCenter = sRect.top + sRect.height / 2;
              const containerCenter = cRect.top + cRect.height / 2;
              tocContainer.scrollBy({top: targetCenter - containerCenter, behavior: 'smooth'});
            }
          }

          // Calculate slider position
          if (slider) slider.style.transition = '';
          prevLi = li;
          updateSliderPosition();
          updateFloatingParent();

          firstTick = false;
        } else if (slider) {
          slider.style.opacity = '0';
        }
      }
      updateFloatingParent();
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      slider?.remove();
      floatingClone?.remove();
      floatingTarget = null;
      root!.querySelectorAll(`.${ITEM_ACTIVE}`).forEach(el => el.classList.remove(ITEM_ACTIVE));
      if (container) container.removeEventListener('scroll', onContainerScroll);
    };
  }, [rootRef]);
}

function TOCItemTree({toc, className, linkClassName, isChild}: Props): ReactNode {
  if (!toc.length) return null;
  const ulRef = useRef<HTMLUListElement>(null);
  if (!isChild) useSlider(ulRef);

  return (
    <ul ref={isChild ? undefined : ulRef} className={isChild ? 'toc-timeline__children' : `${className ?? ''} toc-timeline`}>
      {toc.map((heading) => {
        const {emoji, text} = extractEmoji(heading.value);
        const hasChildren = heading.children.length > 0;
        return (
          <li key={heading.id} className={`toc-timeline__item${hasChildren ? ' toc-timeline__item--parent' : ''}`}>
            <div className="toc-timeline__row">
              <span className="toc-timeline__marker">
                {emoji
                  ? <span dangerouslySetInnerHTML={{__html: emojiImg(emoji)}} />
                  : <span className="toc-timeline__dot" />}
              </span>
              <Link
                to={`#${heading.id}`}
                className={`${linkClassName ?? ''} toc-timeline__link`}
                dangerouslySetInnerHTML={{__html: replaceEmojis(text)}}
              />
            </div>
            {hasChildren && (
              <TOCItemTree isChild toc={heading.children} className={className} linkClassName={linkClassName} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default React.memo(TOCItemTree);
