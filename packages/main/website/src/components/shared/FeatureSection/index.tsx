import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface FeatureSectionProps {
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  children: ReactNode;
}

export function FeatureSection({
  imageSrc,
  imageAlt,
  imagePosition = "left",
  children,
}: FeatureSectionProps): ReactNode {
  return (
    <div className={`${styles.featureSection} ${styles[imagePosition]}`}>
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={imageAlt} width="200" height="200" />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
