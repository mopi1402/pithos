import React, {type ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

type ImageFormat = 'avif' | 'webp' | 'png' | 'jpg';

interface PictureProps {
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  formats?: ImageFormat[];
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
}

export function Picture({
  src,
  alt,
  widths = [400, 800, 1200],
  sizes = '100vw',
  formats = ['avif', 'webp', 'png'],
  width,
  height,
  loading = 'lazy',
  className,
  style,
  inline = false,
}: PictureProps): ReactNode {
  const fallback = formats.at(-1)!;
  const sources = formats.slice(0, -1);

  const buildSrcSet = (fmt: string) =>
    widths.map((w) => `${src}-${w}.${fmt} ${w}w`).join(', ');

  return (
    <picture className={clsx(styles.picture, inline && styles.inline, className)} style={style}>
      {sources.map((fmt) => (
        <source
          key={fmt}
          type={`image/${fmt}`}
          srcSet={buildSrcSet(fmt)}
          sizes={sizes}
        />
      ))}
      <img
        src={`${src}-${widths[1] ?? widths[0]}.${fallback}`}
        srcSet={buildSrcSet(fallback!)}
        sizes={sizes}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        alt={alt}
        className={clsx(styles.img, inline && styles.inlineImg)}
      />
    </picture>
  );
}
