import type { ReactNode, CSSProperties, MouseEvent } from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { GREEK_LETTERS } from "@site/src/data/greekLetters";
import { MODULE_LIST, type ModuleItem } from "@site/src/data/modules";

type BurstLetter = {
  id: number;
  char: string;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  speed: number;
  dz: number;
  rx: number;
  ry: number;
};

export function ModuleCard({
  name,
  description,
  docLink,
  apiLink,
  status,
}: ModuleItem): ReactNode {
  const cardRef = useRef<HTMLDivElement>(null);
  const [letters, setLetters] = useState<BurstLetter[]>([]);
  const history = useHistory();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) {
      return;
    }
    history.push(docLink);
  };

  const triggerBurst = () => {
    const count = Math.floor(Math.random() * 4) + 5;
    const now = Date.now();
    const frontCount = 2 + Math.floor(Math.random() * 2);

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxRight = viewportWidth - cardCenterX;
    const maxLeft = cardCenterX;
    const maxDown = viewportHeight - cardCenterY;
    const maxUp = cardCenterY;

    const items = Array.from({ length: count }, (_v, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const baseDistance = 320 + Math.random() * 520;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let maxDistance = baseDistance;
      if (cos > 0) {
        maxDistance = Math.min(maxDistance, maxRight);
      } else {
        maxDistance = Math.min(maxDistance, maxLeft);
      }
      if (sin > 0) {
        maxDistance = Math.min(maxDistance, maxDown);
      } else {
        maxDistance = Math.min(maxDistance, maxUp);
      }

      const distance = Math.max(200, maxDistance);
      const duration = 220 + Math.random() * 260;
      const delay = Math.random() * 40;
      const speed = 2.2 + Math.random() * 1.4;
      const isFront = idx < frontCount;
      const dz = isFront
        ? 250 + Math.random() * 250
        : -150 + Math.random() * 300;
      const rx = isFront ? 0 : -25 + Math.random() * 50;
      const ry = isFront ? 0 : -25 + Math.random() * 50;
      return {
        id: now + idx,
        char: GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)],
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        duration,
        delay,
        speed,
        dz,
        rx,
        ry,
      };
    });
    setLetters(items);
  };

  useEffect(() => {
    if (letters.length === 0) {
      return;
    }

    const maxDuration = Math.max(
      ...letters.map((item) => item.duration * item.speed + item.delay)
    );

    const cleanupTimer = setTimeout(() => {
      setLetters([]);
    }, maxDuration + 100);

    return () => {
      clearTimeout(cleanupTimer);
    };
  }, [letters]);

  return (
    <div className={clsx("col col--4")}>
      <div
        ref={cardRef}
        className={clsx("text--center", styles.moduleCard)}
        onMouseEnter={triggerBurst}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            history.push(docLink);
          }
        }}
        aria-label={`${name} module: ${description}`}
      >
        <div className={styles.letterBurst}>
          {letters.map((letter) => (
            <span
              key={letter.id}
              style={
                {
                  "--dx": `${letter.dx}px`,
                  "--dy": `${letter.dy}px`,
                  "--dur": `${letter.duration}ms`,
                  "--delay": `${letter.delay}ms`,
                  "--spd": `${letter.speed}`,
                  "--dz": `${letter.dz}px`,
                  "--rx": `${letter.rx}deg`,
                  "--ry": `${letter.ry}deg`,
                } as CSSProperties
              }
            >
              {letter.char}
            </span>
          ))}
        </div>
        {status === "beta" && <span className={styles.betaBadge}>Beta</span>}
        <Heading as="h3">{name}</Heading>
        <p className={styles.moduleDescription}>{description}</p>
        <div className={styles.moduleLinks}>
          <Link
            className={clsx("button button--sm", styles.docsButton)}
            to={docLink}
            aria-label={`${name} documentation`}
          >
            Docs
          </Link>
          <Link
            className={clsx("button button--sm", styles.apiButton)}
            to={apiLink}
            aria-label={`${name} API reference`}
          >
            API
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ModulesListProps {
  modules?: ModuleItem[];
}

export default function ModulesList({
  modules = MODULE_LIST,
}: ModulesListProps): ReactNode {
  return (
    <section className={styles.modulesSection} aria-label="Available modules">
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Modules
        </Heading>
        <div className={clsx("row", styles.modulesGrid)}>
          {modules.map((module, idx) => (
            <ModuleCard key={idx} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
}
