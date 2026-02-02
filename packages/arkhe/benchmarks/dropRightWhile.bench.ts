// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { dropRightWhile as dropRightWhileToolkit_ } from 'es-toolkit';
import { dropRightWhile as dropRightWhileCompatToolkit_ } from 'es-toolkit/compat';
import { dropRightWhile as dropRightWhileLodashEs_ } from 'lodash-es';
import { dropRightWhile as dropRightWhileArkhe_ } from '../../pithos/src/arkhe/array/drop-right-while';

const dropRightWhileToolkit = dropRightWhileToolkit_;
const dropRightWhileCompatToolkit = dropRightWhileCompatToolkit_;
const dropRightWhileLodashEs = dropRightWhileLodashEs_;
const dropRightWhileArkhe = dropRightWhileArkhe_;

describe('dropRightWhile', () => {
  bench('es-toolkit/dropRightWhile', () => {
    dropRightWhileToolkit([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('es-toolkit/compat/dropRightWhile', () => {
    dropRightWhileCompatToolkit([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('lodash-es/dropRightWhile', () => {
    dropRightWhileLodashEs([1.2, 2.3, 3.4], x => x < 2);
  });

  bench('arkhe/dropRightWhile', () => {
    dropRightWhileArkhe([1.2, 2.3, 3.4], x => x < 2);
  });
});

describe('dropRightWhile/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/dropRightWhile', () => {
    dropRightWhileToolkit(largeArray, x => x < 5000);
  });

  bench('es-toolkit/compat/dropRightWhile', () => {
    dropRightWhileCompatToolkit(largeArray, x => x < 5000);
  });

  bench('lodash-es/dropRightWhile', () => {
    dropRightWhileLodashEs(largeArray, x => x < 5000);
  });

  bench('arkhe/dropRightWhile', () => {
    dropRightWhileArkhe(largeArray, x => x < 5000);
  });
});
