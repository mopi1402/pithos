import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface EmojiProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Emoji({ src, alt, className, style }: EmojiProps): React.ReactElement {
  const resolvedSrc = useBaseUrl(src);
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
