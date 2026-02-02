// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { words as wordsToolkit_ } from 'es-toolkit';
import { words as wordsCompatToolkit_ } from 'es-toolkit/compat';
import { words as wordsLodashEs_ } from 'lodash-es';
import { words as wordsArkhe_ } from '../../pithos/src/arkhe/string/words';

const wordsToolkit = wordsToolkit_;
const wordsCompatToolkit = wordsCompatToolkit_;
const wordsLodashEs = wordsLodashEs_;
const wordsArkhe = wordsArkhe_;

describe('words', () => {
  const testString = 'This is a test string with different_cases and UPPERCASE words 🚀 and more symbols';

  bench('es-toolkit/words', () => {
    wordsToolkit(testString);
  });

  bench('es-toolkit/compat/words', () => {
    wordsCompatToolkit(testString);
  });

  bench('lodash-es/words', () => {
    wordsLodashEs(testString);
  });

  bench('arkhe/words', () => {
    wordsArkhe(testString);
  });
});
