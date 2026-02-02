// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { countBy as countByToolkit_ } from 'es-toolkit';
import { countBy as countByLodashEs_ } from 'lodash-es';
import { countBy as countByArkhe_ } from '../../pithos/src/arkhe/array/count-by';

const countByToolkit = countByToolkit_;
const countByLodashEs = countByLodashEs_;
const countByArkhe = countByArkhe_;

describe('countBy', () => {
  bench('es-toolkit/countBy', () => {
    countByToolkit([1.2, 2.4, 3.6, 2.2, 3.4, 3.6], (item: number) => {
          return Math.floor(item).toString();
        });
  });

  bench('lodash-es/countBy', () => {
    countByLodashEs([1.2, 2.4, 3.6, 2.2, 3.4, 3.6], (item: number) => {
          return Math.floor(item).toString();
        });
  });

  bench('arkhe/countBy', () => {
    countByArkhe([1.2, 2.4, 3.6, 2.2, 3.4, 3.6], (item: number) => {
          return Math.floor(item).toString();
        });
  });
});

describe('countBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i + 0.5);

  bench('es-toolkit/countBy', () => {
    countByToolkit(largeArray, (item: number) => {
          return Math.floor(item).toString();
        });
  });

  bench('lodash-es/countBy', () => {
    countByLodashEs(largeArray, (item: number) => {
          return Math.floor(item).toString();
        });
  });

  bench('arkhe/countBy', () => {
    countByArkhe(largeArray, (item: number) => {
          return Math.floor(item).toString();
        });
  });
});
