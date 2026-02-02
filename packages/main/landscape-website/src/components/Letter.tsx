import type { JSX } from "preact";

interface LetterProps {
  letter: string;
  className: string;
  style: JSX.CSSProperties;
}

function Letter({ letter, className, style }: LetterProps) {
  return (
    <span className={className} style={style}>
      {letter}
    </span>
  );
}

export default Letter;
