import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import { KEY_FIGURES, type KeyFigure } from "@site/src/data/homepage/key-figures";

export function KeyFigureCard({
  value,
  label,
  suffix,
  prefix,
  highlight,
  link,
}: KeyFigure): ReactNode {
  const content = (
    <>
      <div className={styles.figureValue}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{value}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      <div className={styles.figureLabel}>{label}</div>
      {highlight && <div className={styles.figureHighlight}>{highlight}</div>}
    </>
  );

  if (link) {
    return (
      <Link to={link} className={styles.figureCard}>
        {content}
      </Link>
    );
  }

  return <div className={styles.figureCard}>{content}</div>;
}

interface KeyFiguresProps {
  figures?: KeyFigure[];
}

export default function KeyFigures({
  figures = KEY_FIGURES,
}: KeyFiguresProps): ReactNode {
  return (
    <section className={styles.keyFigures} aria-label={translate({ id: 'homepage.keyFigures.ariaLabel', message: 'Key metrics' })}>
      <div className="container">
        <div className={styles.figuresGrid}>
          {figures.map((figure, idx) => (
            <KeyFigureCard key={idx} {...figure} />
          ))}
        </div>
      </div>
    </section>
  );
}
