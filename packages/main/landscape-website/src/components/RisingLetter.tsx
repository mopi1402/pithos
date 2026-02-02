import type { JSX } from "preact";
import Letter from "./Letter";
import { RisingLetter as RisingLetterType } from "../types/risingLetters";

interface RisingLetterProps {
  letter: RisingLetterType;
}

function RisingLetter({ letter }: RisingLetterProps) {
  const style = {
    left: `${letter.startX}%`,
    bottom: "50%",
    animationDuration: `${letter.duration}s`,
    animationDelay: `${letter.delay}s`,
    "--letter-opacity": letter.opacity,
  } as JSX.CSSProperties & {
    "--letter-opacity": number;
  };

  return (
    <Letter letter={letter.letter} className="rising-letter" style={style} />
  );
}

export default RisingLetter;
