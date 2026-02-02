// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { mapKeys as mapKeysToolkit_ } from 'es-toolkit';
import { mapKeys as mapKeysCompatToolkit_ } from 'es-toolkit/compat';
import { mapKeys as mapKeysLodashEs_ } from 'lodash-es';
import { mapKeys as mapKeysArkhe_ } from '../../pithos/src/arkhe/object/map-keys';

const mapKeysToolkit = mapKeysToolkit_;
const mapKeysCompatToolkit = mapKeysCompatToolkit_;
const mapKeysLodashEs = mapKeysLodashEs_;
const mapKeysArkhe = mapKeysArkhe_;

describe('mapKeys', () => {
  bench('es-toolkit/mapKeys', () => {
    mapKeysToolkit({ a: 1, b: 2, c: 3 }, (_value, key) => `${key}a`);
  });

  bench('es-toolkit/compat/mapKeys', () => {
    mapKeysCompatToolkit({ a: 1, b: 2, c: 3 }, (_value, key) => `${key}a`);
  });

  bench('lodash-es/mapKeys', () => {
    mapKeysLodashEs({ a: 1, b: 2, c: 3 }, (_value, key) => `${key}a`);
  });

  bench('arkhe/mapKeys', () => {
    mapKeysArkhe({ a: 1, b: 2, c: 3 }, (_value, key) => `${key}a`);
  });
});
