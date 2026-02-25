import type { ReactNode } from "react";
import { useCallback, useRef, useState, useEffect, lazy, Suspense } from "react";
import { translate } from "@docusaurus/Translate";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { Picture } from "@site/src/components/shared/Picture";
import { VORTEX_CONFIGS } from "@site/src/data/homepage/vortex";

// Lazy-load only decorative/non-critical components
const VortexCanvas = lazy(() => import("@site/src/components/homepage/VortexCanvas"));
const PithosEasterEgg = lazy(() => import("@site/src/components/homepage/PithosEasterEgg"));
const DevModeToast = lazy(() => import("@site/src/components/homepage/DevModeToast"));

// Main content sections: NOT lazy-loaded to avoid SSG→hydration flash (CLS)
import KeyFigures from "@site/src/components/homepage/KeyFigures";
import FeaturesGrid from "@site/src/components/homepage/FeaturesGrid";
import ModulesList from "@site/src/components/homepage/ModulesList";
import { usePithosEasterEgg } from "@site/src/hooks/usePithosEasterEgg";

/**
 * Defer rendering of a component until the browser is idle.
 * This prevents decorative/non-critical components (like VortexCanvas)
 * from competing with LCP paint on the main thread.
 */
function useIdleDefer(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true));
      return () => cancelIdleCallback(id);
    }
    // Fallback: defer to next frame
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}

import styles from "./index.module.css";

interface HomepageHeaderProps {
  jarRef: React.RefObject<HTMLDivElement | null>;
  handleClick: () => void;
  jarHidden: boolean;
  easterEgg: { startRect: DOMRect } | null;
  animating: boolean;
  onClose: () => void;
  onReady: () => void;
  onReturnDone: () => void;
}

function HomepageHeader({
  jarRef, handleClick, jarHidden, easterEgg,
  animating, onClose, onReady, onReturnDone,
}: HomepageHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div
            className={styles.heroImage}
            ref={jarRef}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
            style={{ visibility: jarHidden ? 'hidden' : 'visible' }}
          >
            <Picture
              src="/img/generated/logos/pithos"
              alt="Pithos - TypeScript utilities library with zero dependencies"
              displaySize={180}
              sourceWidth={180}
              sourceHeight={242}
              priority
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle} ref={titleRef}>Pithos</h1>
            <p className={styles.heroTagline} ref={taglineRef}>
              <span style={{whiteSpace: 'nowrap'}}>{translate({ id: 'homepage.hero.tagline1', message: 'Everything you need.' })}</span>{' '}
              <span style={{whiteSpace: 'nowrap'}}>{translate({ id: 'homepage.hero.tagline2', message: 'Nothing you don\'t.' })}</span>
              <br className={styles.desktopBreak} />
              <span style={{whiteSpace: 'nowrap'}}>{translate({ id: 'homepage.hero.tagline3', message: 'Zero dependencies.' })}</span>{' '}
              <span style={{whiteSpace: 'nowrap'}}>{translate({ id: 'homepage.hero.tagline4', message: '100%\u00A0TypeScript.' })}</span>
            </p>
            <div className={styles.heroButtons}>
              <Link className={styles.buttonPrimary} to="/guide/get-started">
                {translate({ id: 'homepage.hero.getStarted', message: 'Get Started' })}
              </Link>
              <Link className={styles.buttonSecondary} to="/guide/basics/practical-example">
                {translate({ id: 'homepage.hero.inAction', message: 'Pithos in Action' })}
              </Link>
              <Link className={styles.buttonSecondary} to="/comparisons/overview">
                {translate({ id: 'homepage.hero.yetAnother', message: 'Yet another toolkit?' })}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {easterEgg && (
        <Suspense fallback={null}>
          <PithosEasterEgg
            startRect={easterEgg.startRect}
            titleRect={titleRef.current?.getBoundingClientRect() ?? null}
            taglineRect={taglineRef.current?.getBoundingClientRect() ?? null}
            heroTitleRef={titleRef}
            heroTaglineRef={taglineRef}
            heroJarRef={jarRef}
            animating={animating}
            onClose={onClose}
            onReady={onReady}
            onReturnDone={onReturnDone}
          />
        </Suspense>
      )}
    </>
  );
}

export default function Home(): ReactNode {
  const egg = usePithosEasterEgg();
  const vortexReady = useIdleDefer();

  const handleEasterEggReady = useCallback(() => {
    egg.setJarHidden(true);
    egg.setAnimating(true);
  }, [egg.setJarHidden, egg.setAnimating]);

  return (
    <Layout
      title="TypeScript Utilities Library with Zero Dependencies"
      description={translate({ id: 'homepage.meta.description', message: 'Pithos is a complete TypeScript utilities library with zero dependencies. Includes tree-shakable utilities, schema validation, Result types, and more. A modern alternative to Lodash, Zod, and Neverthrow.' })}
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pithos.dev/" />
      </Head>
      {vortexReady && (
        <Suspense fallback={null}>
          <VortexCanvas configs={VORTEX_CONFIGS} paused={egg.easterEgg != null} />
        </Suspense>
      )}
      <HomepageHeader
        jarRef={egg.jarRef}
        handleClick={egg.handleClick}
        jarHidden={egg.jarHidden}
        easterEgg={egg.easterEgg}
        animating={egg.animating}
        onClose={egg.close}
        onReady={handleEasterEggReady}
        onReturnDone={egg.finishReturn}
      />
      <Suspense fallback={null}>
        <DevModeToast countdown={egg.devModeCountdown} unlocked={egg.devModeUnlocked} />
      </Suspense>
      <main>
        <KeyFigures />
        <FeaturesGrid />
        <ModulesList />
      </main>
    </Layout>
  );
}
