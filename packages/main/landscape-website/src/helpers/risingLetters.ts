import { GREEK_LETTERS } from "../data/greekLetters";
import { RisingLetter } from "../types/risingLetters";

export const createRisingLetters = (
  minLetters: number,
  maxLetters: number
): RisingLetter[] => {
  const numLetters =
    Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;
  const lettersArray: RisingLetter[] = [];

  for (let i = 0; i < numLetters; i++) {
    const startX = 45 + Math.random() * 10;
    const delay = (i / numLetters) * 1.5 + Math.random() * 0.3;
    const duration = 1.2 + Math.random() * 0.4;
    const opacity = 0.7 + Math.random() * 0.25;

    lettersArray.push({
      letter: GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)],
      delay,
      duration,
      startX,
      opacity,
    });
  }

  return lettersArray;
};
