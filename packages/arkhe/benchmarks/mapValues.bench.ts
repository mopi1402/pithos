// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { mapValues as mapValuesToolkit_ } from 'es-toolkit';
import { mapValues as mapValuesCompatToolkit_ } from 'es-toolkit/compat';
import { mapValues as mapValuesLodashEs_ } from 'lodash-es';
import { mapValues as mapValuesArkhe_ } from '../../pithos/src/arkhe/object/map-values';

const mapValuesToolkit = mapValuesToolkit_;
const mapValuesCompatToolkit = mapValuesCompatToolkit_;
const mapValuesLodashEs = mapValuesLodashEs_;
const mapValuesArkhe = mapValuesArkhe_;

describe('mapValues', () => {
  bench('es-toolkit/mapValues', () => {
    mapValuesToolkit({ a: 1, b: 2, c: 3 }, value => `${value}a`);
  });

  bench('es-toolkit/compat/mapValues', () => {
    mapValuesCompatToolkit({ a: 1, b: 2, c: 3 }, value => `${value}a`);
  });

  bench('lodash-es/mapValues', () => {
    mapValuesLodashEs({ a: 1, b: 2, c: 3 }, value => `${value}a`);
  });

  bench('arkhe/mapValues', () => {
    mapValuesArkhe({ a: 1, b: 2, c: 3 }, value => `${value}a`);
  });
});
