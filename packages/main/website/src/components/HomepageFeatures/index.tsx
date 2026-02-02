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

function Module({ name, description, linkText, linkTo }: ModuleItem) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [letters, setLetters] = useState<BurstLetter[]>([]);
  const history = useHistory();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on the button (it has its own link)
    if ((e.target as HTMLElement).closest("a")) {
      return;
    }
    history.push(linkTo);
  };

  const triggerBurst = () => {
    const count = Math.floor(Math.random() * 4) + 5;
    const now = Date.now();
    const frontCount = 2 + Math.floor(Math.random() * 2);

    // Get card position relative to viewport
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate max distances in each direction
    const maxRight = viewportWidth - cardCenterX;
    const maxLeft = cardCenterX;
    const maxDown = viewportHeight - cardCenterY;
    const maxUp = cardCenterY;

    const items = Array.from({ length: count }, (_v, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const baseDistance = 320 + Math.random() * 520;

      // Calculate max distance for this angle
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let maxDistance = baseDistance;
      if (cos > 0) {
        // Moving right
        maxDistance = Math.min(maxDistance, maxRight);
      } else {
        // Moving left
        maxDistance = Math.min(maxDistance, maxLeft);
      }
      if (sin > 0) {
        // Moving down
        maxDistance = Math.min(maxDistance, maxDown);
      } else {
        // Moving up
        maxDistance = Math.min(maxDistance, maxUp);
      }

      // Ensure minimum distance for visual effect
      const distance = Math.max(200, maxDistance);

      const duration = 220 + Math.random() * 260; // x2 faster blast
      const delay = Math.random() * 40;
      const speed = 2.2 + Math.random() * 1.4; // boosted speed
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

  // Cleanup letters after animation completes
  useEffect(() => {
    if (letters.length === 0) {
      return;
    }

    // Calculate max animation time (duration * speed + delay)
    const maxDuration = Math.max(
      ...letters.map((item) => item.duration * item.speed + item.delay)
    );

    const cleanupTimer = setTimeout(() => {
      setLetters([]);
    }, maxDuration + 100); // Add 100ms buffer

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
            history.push(linkTo);
          }
        }}
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
        <Heading as="h3">{name}</Heading>
        <p className={styles.moduleDescription}>{description}</p>
        <Link className="button button--secondary button--sm" to={linkTo}>
          {linkText}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {MODULE_LIST.map((props, idx) => (
            <Module key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
