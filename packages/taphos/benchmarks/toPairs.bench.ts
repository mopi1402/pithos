// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toPairs as toPairsCompatToolkit_ } from 'es-toolkit/compat';
import { toPairs as toPairsLodashEs_ } from 'lodash-es';
import { toPairs as toPairsTaphos_ } from '../../pithos/src/taphos/object/toPairs';

const toPairsCompatToolkit = toPairsCompatToolkit_;
const toPairsLodashEs = toPairsLodashEs_;
const toPairsTaphos = toPairsTaphos_;

describe('toPairs/object', () => {
  bench('es-toolkit/compat/toPairs', () => {
    toPairsCompatToolkit({ a: 1, b: 2 });
  });

  bench('lodash-es/toPairs', () => {
    toPairsLodashEs({ a: 1, b: 2 });
  });

  bench('taphos/toPairs', () => {
    toPairsTaphos({ a: 1, b: 2 });
  });

  bench('native/toPairs', () => {
    Object.entries({ a: 1, b: 2 });
  });
});

describe('toPairs/set', () => {
  bench('es-toolkit/compat/toPairs', () => {
    toPairsCompatToolkit(new Set([1, 2]));
  });

  bench('lodash-es/toPairs', () => {
    toPairsLodashEs(new Set([1, 2]));
  });

  bench('taphos/toPairs', () => {
    toPairsTaphos(new Set([1, 2]));
  });
});

describe('toPairs/map', () => {
  const map = new Map();

  bench('es-toolkit/compat/toPairs', () => {
    toPairsCompatToolkit(map);
  });

  bench('lodash-es/toPairs', () => {
    toPairsLodashEs(map);
  });

  bench('taphos/toPairs', () => {
    toPairsTaphos(map);
  });
});
