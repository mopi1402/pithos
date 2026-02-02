// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { invert as invertCompatToolkit_ } from 'es-toolkit/compat';
import { invert as invertLodashEs_ } from 'lodash-es';
import { invert as invertArkhe_ } from '../../pithos/src/arkhe/object/invert';

const invertCompatToolkit = invertCompatToolkit_;
const invertLodashEs = invertLodashEs_;
const invertArkhe = invertArkhe_;

const object = { a: 1, b: 2, c: 3 };

describe('invert', () => {
  bench('es-toolkit/compat/invert', () => {
    invertCompatToolkit(object);
  });

  bench('lodash-es/invert', () => {
    invertLodashEs(object);
  });

  bench('arkhe/invert', () => {
    invertArkhe(object);
  });
});
