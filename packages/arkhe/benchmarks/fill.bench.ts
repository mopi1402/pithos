// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { fill as fillToolkit_ } from 'es-toolkit';
import { fill as fillCompatToolkit_ } from 'es-toolkit/compat';
import { fill as fillLodashEs_ } from 'lodash-es';
import { fill as fillArkhe_ } from '../../pithos/src/arkhe/array/fill';

const fillToolkit = fillToolkit_;
const fillCompatToolkit = fillCompatToolkit_;
const fillLodashEs = fillLodashEs_;
const fillArkhe = fillArkhe_;

describe('fill', () => {
  bench('es-toolkit/fill', () => {
    fillToolkit([1, 2, 3], 10);
  });

  bench('es-toolkit/compat/fill', () => {
    fillCompatToolkit([1, 2, 3], 10);
  });

  bench('lodash-es/fill', () => {
    fillLodashEs([1, 2, 3], 10);
  });

  bench('arkhe/fill', () => {
    fillArkhe([1, 2, 3], 10);
  });
});

describe('fill/customRange', () => {
  bench('es-toolkit/fill', () => {
    fillToolkit([4, 6, 8, 10], 0, 1, 3);
  });

  bench('es-toolkit/compat/fill', () => {
    fillCompatToolkit([4, 6, 8, 10], 0, 1, 3);
  });

  bench('lodash-es/fill', () => {
    fillLodashEs([4, 6, 8, 10], 0, 1, 3);
  });

  bench('arkhe/fill', () => {
    fillArkhe([4, 6, 8, 10], 0, 1, 3);
  });
});
