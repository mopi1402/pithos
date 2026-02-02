// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { reduceRight as reduceRightCompatToolkit_ } from 'es-toolkit/compat';
import { reduceRight as reduceRightLodashEs_ } from 'lodash-es';
import { reduceRight as reduceRightTaphos_ } from '../../pithos/src/taphos/collection/reduceRight';

const reduceRightCompatToolkit = reduceRightCompatToolkit_;
const reduceRightLodashEs = reduceRightLodashEs_;
const reduceRightTaphos = reduceRightTaphos_;

const array = [1, 2, 3, 4, 5];

describe('reduceRight', () => {
  bench('es-toolkit/compat/reduceRight', () => {
    reduceRightCompatToolkit(array, (acc, x) => acc + x, 0);
  });

  bench('lodash-es/reduceRight', () => {
    reduceRightLodashEs(array, (acc, x) => acc + x, 0);
  });

  bench('taphos/reduceRight', () => {
    reduceRightTaphos(array, (acc, x) => acc + x, 0);
  });

  bench('native/reduceRight', () => {
    array.reduceRight((acc, x) => acc + x, 0);
  });
});

describe('reduceRight/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);

  bench('es-toolkit/compat/reduceRight', () => {
    reduceRightCompatToolkit(largeArray, (acc, x) => acc + x, 0);
  });

  bench('lodash-es/reduceRight', () => {
    reduceRightLodashEs(largeArray, (acc, x) => acc + x, 0);
  });

  bench('taphos/reduceRight', () => {
    reduceRightTaphos(largeArray, (acc, x) => acc + x, 0);
  });

  bench('native/reduceRight', () => {
    largeArray.reduceRight((acc, x) => acc + x, 0);
  });
});
