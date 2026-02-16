import type { ReactNode } from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import Admonition from "@theme/Admonition";
import { translate } from "@docusaurus/Translate";
import { useLocation, useHistory } from "@docusaurus/router";
import { useSmartSearch } from "@site/src/hooks/useSmartSearch";
import { Picture } from "@site/src/components/shared/Picture";

import styles from "./styles.module.css";

// Import generated data (will be generated at build time)
import useCasesData from "@site/src/data/generated/use-cases.json";
// embeddingsData will be loaded via fetch to avoid bloating the bundle

type UseCase = {
  title: string;
  primary: boolean;
  description: string;
  code: string;
  keywords: string[];
};

type UtilData = {
  id: string;
  module: string;
  category: string;
  name: string;
  popular: boolean;
  gem?: boolean;
  useCases: UseCase[];
};

type Filters = {
  topPicks: boolean;
  hiddenGems: boolean;
};

type UseCasesDataType = {
  generatedAt: string;
  totalUtils: number;
  totalUseCases: number;
  utils: UtilData[];
};

type EmbeddingEntry = {
  id: string;
  text: string;
  utilId: string;
  useCaseIndex: number;
};

type EmbeddingsDataType = {
  generatedAt: string;
  entries: EmbeddingEntry[];
};

// Flattened item for virtual list
type FlatItem = {
  type: "useCase";
  util: UtilData;
  useCase: UseCase;
  useCaseIndex: number;
  highlighted: boolean;
};

// Fallback data if files don't exist yet
const FALLBACK_DATA: UseCasesDataType = {
  generatedAt: new Date().toISOString(),
  totalUtils: 0,
  totalUseCases: 0,
  utils: [],
};

const FALLBACK_EMBEDDINGS: EmbeddingsDataType = {
  generatedAt: new Date().toISOString(),
  entries: [],
};

function SearchBar({
  value,
  onChange,
  isModelReady,
  loadingProgress,
  loadingStatus,
  isSearching,
  resultCount,
}: {
  value: string;
  onChange: (value: string) => void;
  isModelReady: boolean;
  loadingProgress: number;
  loadingStatus: string;
  isSearching: boolean;
  resultCount: number;
}) {
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearching, setShowSearching] = useState(false);
  const [fadeOutSearching, setFadeOutSearching] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isModelReady && loadingProgress >= 100) {
      // Wait a bit to show 100%, then start fade out
      const showTimer = setTimeout(() => {
        setFadeOut(true);
        // Remove from DOM after fade animation
        const hideTimer = setTimeout(() => {
          setShowLoading(false);
        }, 400); // Match CSS transition duration
        return () => clearTimeout(hideTimer);
      }, 200); // Show 100% for 200ms
      return () => clearTimeout(showTimer);
    }
  }, [isModelReady, loadingProgress]);

  useEffect(() => {
    if (isSearching) {
      setShowSearching(true);
      setFadeOutSearching(false);
    } else if (showSearching) {
      // Wait for animation to complete one cycle (750ms = half of 1.5s) then fade out
      const completeTimer = setTimeout(() => {
        setFadeOutSearching(true);
        const hideTimer = setTimeout(() => {
          setShowSearching(false);
          setFadeOutSearching(false);
        }, 100); // Fast fade out
        return () => clearTimeout(hideTimer);
      }, 750); // Half cycle (aller-retour)
      return () => clearTimeout(completeTimer);
    }
  }, [isSearching, showSearching]);

  const getPlaceholder = () => {
    if (!isModelReady) {
      return loadingStatus;
    }
    return isMobile 
      ? translate({ id: 'useCases.search.placeholderShort', message: 'Search use cases...' })
      : translate({ id: 'useCases.search.placeholderFull', message: 'Search use cases... (e.g., \'pagination\', \'API calls\', \'I want to manage pages\')' });
  };

  return (
    <>
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={getPlaceholder()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isModelReady}
        aria-label={translate({ id: 'useCases.search.ariaLabel', message: 'Search use cases' })}
      />
      <span className={styles.searchIcon}>🔍</span>
      {showLoading && (
        <div 
          className={styles.loadingBar}
          style={{ 
            opacity: fadeOut ? 0 : 1, 
            transition: 'opacity 0.4s ease-out' 
          }}
        >
          <div
            className={styles.loadingProgress}
            style={{ 
              width: `${Math.min(loadingProgress, 100)}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
          <span className={styles.loadingStatus}>{loadingStatus}</span>
        </div>
      )}
      {showSearching && isModelReady && (
        <div 
          className={styles.searchingBar}
          style={{ 
            opacity: fadeOutSearching ? 0 : 1, 
            transition: 'opacity 0.1s ease-out' 
          }}
        >
          <div className={styles.searchingProgress} />
        </div>
      )}
    </div>
    <div className={styles.searchFooter}>
      {!showLoading && (
        <span className={styles.searchResultCount}>
          {translate(
            { id: 'useCases.search.resultCount', message: '{count} use cases' },
            { count: String(resultCount) }
          )}
        </span>
      )}
    </div>
    </>
  );
}

function FilterBar({
  modules,
  selectedModule,
  onModuleChange,
  filters,
  onFiltersChange,
}: {
  modules: string[];
  selectedModule: string | null;
  onModuleChange: (module: string | null) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}) {
  return (
    <div className={styles.filterBar}>
      {/* Module filters */}
      <div className={styles.filterGroup}>
        {modules.map((module) => (
          <button
            key={module}
            className={`${styles.filterButton} ${selectedModule === module ? styles.filterButtonActive : ""}`}
            onClick={() => onModuleChange(selectedModule === module ? null : module)}
            aria-pressed={selectedModule === module}
          >
            {module}
          </button>
        ))}
      </div>

      {/* Separator */}
      <span className={styles.filterSeparator}>|</span>

      {/* Category toggles */}
      <div className={styles.filterGroup}>
        <button
          className={`${styles.filterButton} ${styles.filterToggle} ${filters.topPicks ? styles.filterButtonActive : ""}`}
          onClick={() => onFiltersChange({ ...filters, topPicks: !filters.topPicks })}
          aria-pressed={filters.topPicks}
        >
          ⭐ {translate({ id: 'useCases.filter.topPicks', message: 'Top Picks' })}
        </button>
        <button
          className={`${styles.filterButton} ${styles.filterToggle} ${filters.hiddenGems ? styles.filterButtonActive : ""}`}
          onClick={() => onFiltersChange({ ...filters, hiddenGems: !filters.hiddenGems })}
          aria-pressed={filters.hiddenGems}
        >
          💎 {translate({ id: 'useCases.filter.hiddenGems', message: 'Hidden Gems' })}
        </button>
      </div>
    </div>
  );
}

function UseCaseCard({
  useCase,
  util,
  highlight,
  isFirst,
  isLast,
}: {
  useCase: UseCase;
  util: UtilData;
  highlight?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const isTaphos = util.module === "taphos";
  const isTopPick = util.popular;
  const isHiddenGem = util.gem || (!util.popular && util.useCases.length > 0);
  
  return (
    <div className={`${styles.useCaseCard} ${highlight ? styles.highlighted : ""} ${isFirst ? styles.firstUseCaseCard : ""} ${isLast ? styles.lastUseCaseCard : ""}`}>
      <div className={styles.useCaseHeader}>
        <span className={styles.useCaseTitle}>
          {useCase.primary && <span className={styles.primaryBadge}>📍</span>}
          {useCase.title}
        </span>
        <div className={styles.utilInfo}>
          <a
            href={`/api/${util.module}/${util.category}/${util.name}/`}
            className={styles.utilName}
          >
            {isTopPick && <span title={translate({ id: 'useCases.card.topPick', message: 'Top Pick' })}>⭐ </span>}
            {isHiddenGem && !isTopPick && <span title={translate({ id: 'useCases.card.hiddenGem', message: 'Hidden Gem' })}>💎 </span>}
            {util.name}()
          </a>
          <span className={styles.moduleBadge}>
            {util.module}/{util.category}
          </span>
        </div>
      </div>
      <p className={styles.useCaseDescription}>{useCase.description}</p>
      <CodeBlock language="typescript" showLineNumbers>
        {useCase.code}
      </CodeBlock>
      {isTaphos && (
        <Admonition type="info" title={translate({ id: 'useCases.card.noteTitle', message: 'Note' })}>
          {translate({ id: 'useCases.card.taphosNote', message: 'This example shows the recommended approach, not the deprecated taphos version.' })}
        </Admonition>
      )}
      
      {useCase.keywords && useCase.keywords.length > 0 && (
        <div className={styles.keywordsContainer}>
          {useCase.keywords.map((keyword) => (
            <a
              key={keyword}
              href={`?q=${encodeURIComponent(keyword)}`}
              className={styles.keywordBadge}
              onClick={(e) => {
                e.preventDefault();
                // Update search via custom event to notify parent
                const url = new URL(window.location.href);
                url.searchParams.set("q", keyword);
                window.history.pushState({}, "", url.toString());
                
                window.dispatchEvent(new CustomEvent('pithos-search-update', { detail: keyword }));
              }}
            >
              #{keyword}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Estimated height for each card (will be measured dynamically)
const ESTIMATED_ITEM_HEIGHT = 280;

export default function UseCasesPage(): ReactNode {
  const location = useLocation();
  const history = useHistory();
  
  // Initialize search query from URL
  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  }, []);
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ topPicks: false, hiddenGems: false });
  const [embeddings, setEmbeddings] = useState<EmbeddingsDataType>(FALLBACK_EMBEDDINGS);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Listen for custom events from keywords
  useEffect(() => {
    const handleSearchUpdate = (e: CustomEvent<string>) => {
       setSearchQuery(e.detail);
       history.push({ search: `?q=${encodeURIComponent(e.detail)}` });
    };
    
    window.addEventListener('pithos-search-update', handleSearchUpdate as EventListener);
    return () => window.removeEventListener('pithos-search-update', handleSearchUpdate as EventListener);
  }, [history]);
  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    const newSearch = params.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    
    // Only update if URL actually changed
    if (newUrl !== `${location.pathname}${location.search}`) {
      history.replace(newUrl);
    }
  }, [searchQuery, location.pathname, location.search, history]);

  // Load embeddings data via fetch (avoid bundle bloat)
  useEffect(() => {
    async function loadEmbeddings() {
      try {
        const response = await fetch("/use_cases/use-cases-embeddings.json");
        if (response.ok) {
          const data = await response.json();
          setEmbeddings(data);
        }
      } catch {
        // Silently fall back to empty embeddings
      }
    }
    loadEmbeddings();
  }, []);

  // Load data with fallbacks
  const data: UseCasesDataType = useCasesData || FALLBACK_DATA;

  // Smart search hook
  const {
    search,
    results: searchResults,
    isModelReady,
    isSearching,
    loadingProgress,
    loadingStatus,
  } = useSmartSearch({
    entries: embeddings.entries,
    debounceMs: 300,
    topK: 30,
    minScore: 0.25,
  });

  // Trigger search when query changes
  useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  const modules = useMemo(() => {
    const moduleSet = new Set(data.utils.map((u) => u.module));
    return Array.from(moduleSet).sort();
  }, [data.utils]);

  // Hybrid search + flatten to individual use cases
  const flatItems = useMemo(() => {
    let utils = data.utils;

    // Filter by module
    if (selectedModule) {
      utils = utils.filter((u) => u.module === selectedModule);
    }

    // Filter by category toggles (cumulative: if both selected, show both)
    if (filters.topPicks || filters.hiddenGems) {
      utils = utils.filter((u) => {
        const isTopPick = u.popular;
        const isHiddenGem = u.gem || (!u.popular && u.useCases.length > 0);
        
        if (filters.topPicks && filters.hiddenGems) {
          return isTopPick || isHiddenGem;
        }
        if (filters.topPicks) return isTopPick;
        if (filters.hiddenGems) return isHiddenGem;
        return true;
      });
    }

    if (!searchQuery.trim()) {
      // No search: show all use cases flattened
      const items: FlatItem[] = [];
      for (const util of utils) {
        for (let i = 0; i < util.useCases.length; i++) {
          items.push({
            type: "useCase",
            util,
            useCase: util.useCases[i],
            useCaseIndex: i,
            highlighted: false,
          });
        }
      }
      return items;
    }

    const query = searchQuery.toLowerCase();
    const matchedUseCases = new Map<string, { score: number; textMatch: boolean }>();

    // Step 1: Text matches get HIGH priority
    const TEXT_MATCH_BOOST = 2.0;

    for (const util of utils) {
      const nameMatch = util.name.toLowerCase().includes(query);

      for (let i = 0; i < util.useCases.length; i++) {
        const uc = util.useCases[i];
        const titleMatch = uc.title.toLowerCase().includes(query);
        const descMatch = uc.description.toLowerCase().includes(query);
        const keywordMatch = uc.keywords?.some((k) => k.toLowerCase().includes(query));

        if (nameMatch || titleMatch || descMatch || keywordMatch) {
          const key = `${util.id}-${i}`;
          matchedUseCases.set(key, { score: TEXT_MATCH_BOOST, textMatch: true });
        }
      }
    }

    // Step 2: Add semantic search results
    for (const result of searchResults) {
      const key = `${result.utilId}-${result.useCaseIndex}`;
      const existing = matchedUseCases.get(key);
      if (!existing) {
        matchedUseCases.set(key, { score: result.score, textMatch: false });
      }
    }

    // Build flat list of matched use cases, sorted by score
    const items: FlatItem[] = [];
    const utilMap = new Map(utils.map((u) => [u.id, u]));

    const sortedKeys = Array.from(matchedUseCases.entries())
      .sort((a, b) => {
        // Text matches first
        if (a[1].textMatch && !b[1].textMatch) return -1;
        if (!a[1].textMatch && b[1].textMatch) return 1;
        return b[1].score - a[1].score;
      })
      .map(([key]) => key);

    for (const key of sortedKeys) {
      const [utilId, indexStr] = key.split(/-(?=\d+$)/);
      const useCaseIndex = parseInt(indexStr, 10);
      const util = utilMap.get(utilId);
      if (util && util.useCases[useCaseIndex]) {
        items.push({
          type: "useCase",
          util,
          useCase: util.useCases[useCaseIndex],
          useCaseIndex,
          highlighted: matchedUseCases.get(key)?.textMatch ?? false,
        });
      }
    }

    return items;
  }, [data.utils, searchQuery, searchResults, selectedModule, filters]);

  // Window Virtual list
  const virtualizer = useWindowVirtualizer({
    count: flatItems.length,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: 5,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  const scrollToTop = () => {
    // First reset the virtualizer to the first item
    virtualizer.scrollToIndex(0);
    // Then scroll the page to top after a short delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  };

  const virtualItems = virtualizer.getVirtualItems();
  
  const sentinelRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (borderRef.current) {
          if (entry.isIntersecting) {
             // Scrolling up: hide instantly to avoid "detaching" ghost effect
             borderRef.current.style.transition = "none";
             borderRef.current.style.opacity = "0";
          } else {
             // Scrolling down: fade in smoothly
             borderRef.current.style.transition = "opacity 0.2s ease";
             borderRef.current.style.opacity = "1";
          }
        }
      },
      { threshold: 1.0, rootMargin: '-51px 0px 0px 0px' } 
    );
    
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title={translate({ id: 'useCases.meta.title', message: 'Use Cases' })}
      description={translate({ id: 'useCases.meta.description', message: 'Find the right Pithos utility for your needs' })}
    >
      <main className={styles.main}>
        <div className={styles.header}>
          <Heading as="h1">
            <Picture 
              src="/img/generated/emoji/treasure-map" 
              alt="treasure map" 
              widths={[32, 48, 64]} 
              sizes="64px"
              inline={true}
              className={styles.headingEmoji}
            />
            {translate({ id: 'useCases.heading', message: 'Use Cases Explorer' })}
          </Heading>
          <p className={styles.subtitle}>
            {translate({ id: 'useCases.subtitle', message: 'Find the right utility for your needs. Search by problem, not by function name.' })}
          </p>
        </div>

        <FilterBar
          modules={modules}
          selectedModule={selectedModule}
          onModuleChange={setSelectedModule}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Sentinel to detect when sticky starts */ }
        <div ref={sentinelRef} style={{ height: "1px", width: "100%" }} />

        <div className={styles.controls} style={{ 
          position: "sticky", 
          top: "var(--ifm-navbar-height)", 
          zIndex: 10,
          background: "transparent",
          pointerEvents: "none", /* Allow clicking through empty areas if any, though children have pointer-events auto */
        }}>
          <div style={{ pointerEvents: "auto", paddingBottom: "10px", paddingTop: "5px", backdropFilter: "blur(12px)", background: "color-mix(in srgb, var(--ifm-background-color) 30%, transparent)", position: "relative" }}>
              {/* Grain overlay */}
              <div style={{
                position: "absolute",
                opacity: 0.03,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                pointerEvents: "none",
              }} />
             <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              isModelReady={isModelReady}
              loadingProgress={loadingProgress}
              loadingStatus={loadingStatus}
              isSearching={isSearching}
              resultCount={flatItems.length}
            />
          </div>
          
          <div 
            ref={borderRef}
            style={{ 
              marginTop: "0px", 
              position: "relative",
              zIndex: 15,
              pointerEvents: "none",
              opacity: 0, // Hidden by default
              width: "100%",
            }} 
          >
            {/* Left Corner Mask - covers content behind the rounded corner with grain */}
            <div style={{
              position: "absolute",
              top: 0,
              left: -1,
              width: "13px",
              height: "13px",
              backgroundColor: "var(--ifm-background-color)",
              WebkitMaskImage: "radial-gradient(circle at 100% 100%, transparent 12px, black 12.5px)",
              maskImage: "radial-gradient(circle at 100% 100%, transparent 12px, black 12.5px)",
              zIndex: 1,
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                opacity: 0.03,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }} />
            </div>

            {/* Right Corner Mask - covers content behind the rounded corner with grain */}
            <div style={{
              position: "absolute",
              top: 0,
              right: -1,
              width: "13px",
              height: "13px",
              backgroundColor: "var(--ifm-background-color)",
              WebkitMaskImage: "radial-gradient(circle at 0% 100%, transparent 12px, black 12.5px)",
              maskImage: "radial-gradient(circle at 0% 100%, transparent 12px, black 12.5px)",
              zIndex: 1,
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                opacity: 0.03,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }} />
            </div>

            {/* Border Line */}
            <div style={{ 
              position: "absolute",
              top: 0,
              width: "100%",
              height: "20px", 
              borderTop: "1px solid var(--ifm-color-emphasis-200)", 
              borderLeft: "1px solid var(--ifm-color-emphasis-200)", 
              borderRight: "1px solid var(--ifm-color-emphasis-200)", 
              borderBottom: "none", 
              borderRadius: "12px 12px 0 0", 
              background: "transparent",
              boxSizing: "border-box",
              zIndex: 2,
            }} />
          </div>
        </div>

        <div ref={parentRef} className={styles.virtualContainer} style={{ height: `${virtualizer.getTotalSize()}px`, overflow: "hidden" }}>
          {flatItems.length === 0 ? (
            <div className={styles.noResults}>
              <p>{translate(
                { id: 'useCases.noResults', message: 'No use cases found for "{query}"' },
                { query: searchQuery }
              )}</p>
              <p className={styles.noResultsHint}>
                {translate({ id: 'useCases.noResultsHint', message: 'Try different keywords or clear filters' })}
              </p>
            </div>
          ) : (
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const item = flatItems[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    <UseCaseCard
                      useCase={item.useCase}
                      util={item.util}
                      highlight={item.highlighted}
                      isFirst={virtualRow.index === 0}
                      isLast={virtualRow.index === flatItems.length - 1}
                    />
                  </div>
                );
              })}
            </div>
        
          )}
        </div>

        <button
          className={`${styles.scrollToTop} ${showScrollTop ? styles.scrollToTopVisible : ""}`}
          onClick={scrollToTop}
          aria-label={translate({ id: 'useCases.scrollToTop', message: 'Scroll to top' })}
        >
          ↑
        </button>
      </main>
    </Layout>
  );
}
