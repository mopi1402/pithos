// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { range as rangeToolkit_ } from 'es-toolkit';
import { range as rangeCompatToolkit_ } from 'es-toolkit/compat';
import { range as rangeLodashEs_ } from 'lodash-es';
import { range as rangeArkhe_ } from '../../pithos/src/arkhe/util/range';

const rangeToolkit = rangeToolkit_;
const rangeCompatToolkit = rangeCompatToolkit_;
const rangeLodashEs = rangeLodashEs_;
const rangeArkhe = rangeArkhe_;

describe('range', () => {
  bench('es-toolkit/range', () => {
    rangeToolkit(0, 100, 1);
  });

  bench('es-toolkit/compat/range', () => {
    rangeCompatToolkit(0, 100, 1);
  });

  bench('lodash-es/range', () => {
    rangeLodashEs(0, 100, 1);
  });

  bench('arkhe/range', () => {
    rangeArkhe(0, 100, 1);
  });
});
