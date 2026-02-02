// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { some as someCompatToolkit_ } from 'es-toolkit/compat';
import { some as someLodashEs_ } from 'lodash-es';
import { some as someTaphos_ } from '../../pithos/src/taphos/collection/some';

const someCompatToolkit = someCompatToolkit_;
const someLodashEs = someLodashEs_;
const someTaphos = someTaphos_;

describe('some', () => {
  bench('es-toolkit/compat/some', () => {
    someCompatToolkit([1, 2, 3], number => number % 2 === 0);
    someCompatToolkit([false, false, false], value => value);
  });

  bench('lodash-es/some', () => {
    someLodashEs([1, 2, 3], number => number % 2 === 0);
    someLodashEs([false, false, false], value => value);
  });

  bench('taphos/some', () => {
    someTaphos([1, 2, 3], number => number % 2 === 0);
    someTaphos([false, false, false], value => value);
  });

  bench('native/some', () => {
    [1, 2, 3].some(number => number % 2 === 0);
    [false, false, false].some(value => value);
  });
});

describe('some/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, index) => index);
  const predicate = (number: number) => number > 5000;

  bench('es-toolkit/compat/some', () => {
    someCompatToolkit(largeArray, predicate);
  });

  bench('lodash-es/some', () => {
    someLodashEs(largeArray, predicate);
  });

  bench('taphos/some', () => {
    someTaphos(largeArray, predicate);
  });

  bench('native/some', () => {
    largeArray.some(predicate);
  });
});
