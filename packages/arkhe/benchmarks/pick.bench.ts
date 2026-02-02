// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { pick as pickToolkit_ } from 'es-toolkit';
import { pick as pickCompatToolkit_ } from 'es-toolkit/compat';
import { pick as pickLodashEs_ } from 'lodash-es';
import { pick as pickArkhe_ } from '../../pithos/src/arkhe/object/pick';

const pickToolkit = pickToolkit_;
const pickCompatToolkit = pickCompatToolkit_;
const pickLodashEs = pickLodashEs_;
const pickArkhe = pickArkhe_;

describe('pick', () => {
  bench('es-toolkit/pick', () => {
    pickToolkit({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('es-toolkit/compat/pick', () => {
    pickCompatToolkit({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('lodash-es/pick', () => {
    pickLodashEs({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('arkhe/pick', () => {
    pickArkhe({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });
});
