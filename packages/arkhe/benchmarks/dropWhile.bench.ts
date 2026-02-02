// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { dropWhile as dropWhileToolkit_ } from 'es-toolkit';
import { dropWhile as dropWhileCompatToolkit_ } from 'es-toolkit/compat';
import { dropWhile as dropWhileLodashEs_ } from 'lodash-es';
import { dropWhile as dropWhileArkhe_ } from '../../pithos/src/arkhe/array/drop-while';

const dropWhileToolkit = dropWhileToolkit_;
const dropWhileCompatToolkit = dropWhileCompatToolkit_;
const dropWhileLodashEs = dropWhileLodashEs_;
const dropWhileArkhe = dropWhileArkhe_;

describe('dropWhile', () => {
  bench('es-toolkit/dropWhile', () => {
    dropWhileToolkit([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('es-toolkit/compat/dropWhile', () => {
    dropWhileCompatToolkit([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('lodash-es/dropWhile', () => {
    dropWhileLodashEs([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('arkhe/dropWhile', () => {
    dropWhileArkhe([1.2, 2.3, 3.4], x => x < 2);
  });
});

describe('dropWhile/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/dropWhile', () => {
    dropWhileToolkit(largeArray, x => x < 5000);
  });

  bench('es-toolkit/compat/dropWhile', () => {
    dropWhileCompatToolkit(largeArray, x => x < 5000);
  });

  bench('lodash-es/dropWhile', () => {
    dropWhileLodashEs(largeArray, x => x < 5000);
  });

  bench('arkhe/dropWhile', () => {
    dropWhileArkhe(largeArray, x => x < 5000);
  });
});
