import React from "react";
import styles from "./styles.module.css";

interface DashedSeparatorProps {
  noMarginTop?: boolean;
  noMarginBottom?: boolean;
}

export function DashedSeparator({ noMarginTop, noMarginBottom }: DashedSeparatorProps): React.ReactElement {
  const style: React.CSSProperties = {
    ...(noMarginTop && { marginTop: 0 }),
    ...(noMarginBottom && { marginBottom: 0 }),
  };
  return <div className={styles.separator} role="separator" style={style} />;
}
