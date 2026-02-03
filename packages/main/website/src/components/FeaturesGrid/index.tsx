import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { FEATURES, type Feature } from "@site/src/data/features";

export function FeatureCard({
  icon,
  title,
  description,
  link,
}: Feature): ReactNode {
  const isImagePath = icon.startsWith("/");
  
  return (
    <Link to={link} className={styles.featureCard}>
      <div className={styles.featureIcon} aria-hidden="true">
        {isImagePath ? (
          <img src={icon} alt={title} width={125} height={125} />
        ) : (
          icon
        )}
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </Link>
  );
}

interface FeaturesGridProps {
  features?: Feature[];
}

export default function FeaturesGrid({
  features = FEATURES,
}: FeaturesGridProps): ReactNode {
  return (
    <section className={styles.featuresSection} aria-label="Features">
      <div className="container">
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
