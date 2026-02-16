import type { ReactNode } from "react";
import { Picture } from "@site/src/components/shared/Picture";
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
        <Picture
          src={imageSrc}
          alt={imageAlt}
          widths={[200, 300, 400]}
          sizes="200px"
          width={200}
          height={200}
        />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
