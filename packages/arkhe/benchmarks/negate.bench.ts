// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { negate as negateToolkit_ } from 'es-toolkit';
import { negate as negateCompatToolkit_ } from 'es-toolkit/compat';
import { negate as negateLodashEs_ } from 'lodash-es';
import { negate as negateArkhe_ } from '../../pithos/src/arkhe/function/negate';

const negateToolkit = negateToolkit_;
const negateCompatToolkit = negateCompatToolkit_;
const negateLodashEs = negateLodashEs_;
const negateArkhe = negateArkhe_;

describe('negate', () => {
  bench('es-toolkit/negate', () => {
    const negated = negateToolkit(() => true);
    negated();
  });

  bench('es-toolkit/compat/negate', () => {
    const negated = negateCompatToolkit(() => true);
    negated();
  });

  bench('lodash-es/negate', () => {
    const negated = negateLodashEs(() => true);
    negated();
  });

  bench('arkhe/negate', () => {
    const negated = negateArkhe(() => true);
    negated();
  });
});
