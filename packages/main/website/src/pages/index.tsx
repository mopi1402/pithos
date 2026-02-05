import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { Picture } from "@site/src/components/shared/Picture";
import VortexCanvas from "@site/src/components/homepage/VortexCanvas";
import KeyFigures from "@site/src/components/homepage/KeyFigures";
import FeaturesGrid from "@site/src/components/homepage/FeaturesGrid";
import ModulesList from "@site/src/components/homepage/ModulesList";
import PithosEasterEgg from "@site/src/components/homepage/PithosEasterEgg";
import DevModeToast from "@site/src/components/homepage/DevModeToast";
import { usePithosEasterEgg } from "@site/src/hooks/usePithosEasterEgg";
import { VORTEX_CONFIGS } from "@site/src/data/homepage/vortex";

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
            style={{ cursor: 'pointer', visibility: jarHidden ? 'hidden' : 'visible' }}
          >
            <Picture
              src="/img/generated/logos/pithos"
              alt="Pithos"
              widths={[120, 180, 360]}
              sizes="(max-width: 600px) 120px, 180px"
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
              <Link className={styles.buttonPrimary} to="/guide/quick-start">
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
      )}
    </>
  );
}

export default function Home(): ReactNode {
  const egg = usePithosEasterEgg();

  const handleEasterEggReady = useCallback(() => {
    egg.setJarHidden(true);
    egg.setAnimating(true);
  }, [egg.setJarHidden, egg.setAnimating]);

  return (
    <Layout
      description={translate({ id: 'homepage.meta.description', message: 'Everything you need. Nothing you don\'t. A complete TypeScript utilities ecosystem with zero dependencies — arrays, objects, validation, error handling and more.' })}
    >
      <Head>
        <title>Pithos | TypeScript Utilities. Zero Dependencies.</title>
        <meta property="og:title" content="Pithos | TypeScript Utilities. Zero Dependencies." />
      </Head>
      <VortexCanvas configs={VORTEX_CONFIGS} paused={egg.easterEgg != null} />
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
      <DevModeToast countdown={egg.devModeCountdown} unlocked={egg.devModeUnlocked} />
      <main>
        <KeyFigures />
        <FeaturesGrid />
        <ModulesList />
      </main>
    </Layout>
  );
}
