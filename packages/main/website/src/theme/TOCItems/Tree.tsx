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

    function ensureSlider() {
      if (!slider) {
        slider = document.createElement('span');
        slider.className = SLIDER_CLS;
        root!.prepend(slider);
      }
      return slider;
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

      if (active !== prevActive) {
        prevActive = active;
        if (prevLi) prevLi.classList.remove(ITEM_ACTIVE);
        const li = active?.closest('.toc-timeline__item') ?? null;
        if (li) {
          li.classList.add(ITEM_ACTIVE);
          const row = li.querySelector('.toc-timeline__row') as HTMLElement;
          if (!slider) {
            slider = document.createElement('span');
            slider.className = SLIDER_CLS;
            root!.prepend(slider);
          }
          const rootRect = root!.getBoundingClientRect();
          const targetRect = (row ?? li).getBoundingClientRect();
          let sliderTop = targetRect.top - rootRect.top;
          let sliderHeight = targetRect.height;
          const items = root!.querySelectorAll(':scope > .toc-timeline__item');
          const isFirst = li === items[0];
          const isLast = li === items[items.length - 1];
          // First item: start bar from center of circle, not top of row
          if (isFirst) {
            const half = targetRect.height / 2;
            sliderTop += half;
            sliderHeight -= half;
          }
          // Last item: end bar at center of circle, not bottom of row
          if (isLast) {
            sliderHeight -= targetRect.height / 2;
          }
          slider.style.top = `${sliderTop}px`;
          slider.style.height = `${sliderHeight}px`;
          slider.style.opacity = '1';
          slider.classList.toggle('toc-timeline__slider--first', isFirst);
          slider.classList.toggle('toc-timeline__slider--last', isLast);
          // Auto-scroll TOC container to keep active item visible
          // Use the row (not the li) so parent items with many children
          // scroll to the heading row instead of the center of all children.
          if (!firstTick) {
            const container = root!.parentElement;
            if (container && container.scrollHeight > container.clientHeight) {
              const cRect = container.getBoundingClientRect();
              const scrollTarget = row ?? li;
              const sRect = scrollTarget.getBoundingClientRect();
              if (sRect.top < cRect.top || sRect.bottom > cRect.bottom) {
                const targetCenter = sRect.top + sRect.height / 2;
                const containerCenter = cRect.top + cRect.height / 2;
                container.scrollBy({top: targetCenter - containerCenter, behavior: 'smooth'});
              }
            }
          }
          firstTick = false;
        } else if (slider) {
          slider.style.opacity = '0';
        }
        prevLi = li;
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      slider?.remove();
      if (prevLi) prevLi.classList.remove(ITEM_ACTIVE);
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
