import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface FeatureSectionProps {
  image: ReactNode;
  imagePosition?: "left" | "right";
  children: ReactNode;
}

export function FeatureSection({
  image,
  imagePosition = "left",
  children,
}: FeatureSectionProps): ReactNode {
  return (
    <div className={`${styles.featureSection} ${styles[imagePosition]}`}>
      <div className={styles.imageContainer}>
        {image}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
