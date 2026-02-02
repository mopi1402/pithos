// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { shuffle as shuffleToolkit_ } from 'es-toolkit';
import { shuffle as shuffleCompatToolkit_ } from 'es-toolkit/compat';
import { shuffle as shuffleLodashEs_ } from 'lodash-es';
import { shuffle as shuffleArkhe_ } from '../../pithos/src/arkhe/array/shuffle';

const shuffleToolkit = shuffleToolkit_;
const shuffleCompatToolkit = shuffleCompatToolkit_;
const shuffleLodashEs = shuffleLodashEs_;
const shuffleArkhe = shuffleArkhe_;

describe('shuffle', () => {
  bench('es-toolkit/shuffle', () => {
    const array = [1, 2, 3, 4, 5];
        shuffleToolkit(array);
  });

  bench('es-toolkit/compat/shuffle', () => {
    const array = [1, 2, 3, 4, 5];
        shuffleCompatToolkit(array);
  });

  bench('lodash-es/shuffle', () => {
    const array = [1, 2, 3, 4, 5];
        shuffleLodashEs(array);
  });

  bench('arkhe/shuffle', () => {
    const array = [1, 2, 3, 4, 5];
        shuffleArkhe(array);
  });
});

describe('shuffle/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/shuffle', () => {
    shuffleToolkit(largeArray);
  });

  bench('es-toolkit/compat/shuffle', () => {
    shuffleCompatToolkit(largeArray);
  });

  bench('lodash-es/shuffle', () => {
    shuffleLodashEs(largeArray);
  });

  bench('arkhe/shuffle', () => {
    shuffleArkhe(largeArray);
  });
});
