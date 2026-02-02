// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { transform as transformCompatToolkit_ } from 'es-toolkit/compat';
import { transform as transformLodashEs_ } from 'lodash-es';
import { transform as transformTaphos_ } from '../../pithos/src/taphos/object/transform';

const transformCompatToolkit = transformCompatToolkit_;
const transformLodashEs = transformLodashEs_;
const transformTaphos = transformTaphos_;

const bigObject = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [String(i), i]));
const smallObject = { a: 1, b: 2, c: 3 };

const objectIteratee = (acc: Record<string, number>, value: number, key: string) => {
  acc[key] = value * value;
};

describe('transform/smallObject', () => {
  bench('es-toolkit/compat/transform', () => {
    transformCompatToolkit(smallObject, objectIteratee);
  });

  bench('lodash-es/transform', () => {
    transformLodashEs(smallObject, objectIteratee);
  });

  bench('taphos/transform', () => {
    transformTaphos(smallObject, objectIteratee, {});
  });

  bench('native/transform', () => {
    Object.entries(smallObject).reduce((acc, [key, value]) => {
      acc[key] = value * value;
      return acc;
    }, {} as Record<string, number>);
  });
});

describe('transform/bigObject', () => {
  bench('es-toolkit/compat/transform', () => {
    transformCompatToolkit(bigObject, objectIteratee);
  });

  bench('lodash-es/transform', () => {
    transformLodashEs(bigObject, objectIteratee);
  });

  bench('taphos/transform', () => {
    transformTaphos(bigObject, objectIteratee, {});
  });

  bench('native/transform', () => {
    Object.entries(bigObject).reduce((acc, [key, value]) => {
      acc[key] = value * value;
      return acc;
    }, {} as Record<string, number>);
  });
});
