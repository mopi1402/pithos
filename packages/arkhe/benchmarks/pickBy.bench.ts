// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { pickBy as pickByToolkit_ } from 'es-toolkit';
import { pickBy as pickByCompatToolkit_ } from 'es-toolkit/compat';
import { pickBy as pickByLodashEs_ } from 'lodash-es';
import { pickBy as pickByArkhe_ } from '../../pithos/src/arkhe/object/pickBy';

const pickByToolkit = pickByToolkit_;
const pickByCompatToolkit = pickByCompatToolkit_;
const pickByLodashEs = pickByLodashEs_;
const pickByArkhe = pickByArkhe_;

describe('pickBy', () => {
  bench('es-toolkit/pickBy', () => {
    pickByToolkit({ foo: 1, bar: '2', baz: 3 }, value => typeof value === 'number');
  });

  bench('es-toolkit/compat/pickBy', () => {
    pickByCompatToolkit({ foo: 1, bar: '2', baz: 3 }, value => typeof value === 'number');
  });

  bench('lodash-es/pickBy', () => {
    pickByLodashEs({ foo: 1, bar: '2', baz: 3 }, value => typeof value === 'number');
  });

  bench('arkhe/pickBy', () => {
    pickByArkhe({ foo: 1, bar: '2', baz: 3 }, value => typeof value === 'number');
  });
});
