// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { clamp as clampToolkit_ } from 'es-toolkit';
import { clamp as clampCompatToolkit_ } from 'es-toolkit/compat';
import { clamp as clampLodashEs_ } from 'lodash-es';
import { clamp as clampArkhe_ } from '../../pithos/src/arkhe/number/clamp';

const clampToolkit = clampToolkit_;
const clampCompatToolkit = clampCompatToolkit_;
const clampLodashEs = clampLodashEs_;
const clampArkhe = clampArkhe_;

describe('clamp', () => {
  bench('es-toolkit/clamp', () => {
    clampToolkit(10, 5, 15);
  });

  bench('es-toolkit/compat/clamp', () => {
    clampCompatToolkit(10, 5, 15);
  });

  bench('lodash-es/clamp', () => {
    clampLodashEs(10, 5, 15);
  });

  bench('arkhe/clamp', () => {
    clampArkhe(10, 5, 15);
  });
});
