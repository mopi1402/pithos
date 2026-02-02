// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { values as valuesCompatToolkit_ } from 'es-toolkit/compat';
import { values as valuesLodashEs_ } from 'lodash-es';
import { values as valuesTaphos_ } from '../../pithos/src/taphos/object/values';

const valuesCompatToolkit = valuesCompatToolkit_;
const valuesLodashEs = valuesLodashEs_;
const valuesTaphos = valuesTaphos_;

const object = { a: 1, b: 2, c: 3 };

describe('values', () => {
  bench('es-toolkit/compat/values', () => {
    valuesCompatToolkit(object);
  });

  bench('lodash-es/values', () => {
    valuesLodashEs(object);
  });

  bench('taphos/values', () => {
    valuesTaphos(object);
  });

  bench('native/values', () => {
    Object.values(object);
  });
});
