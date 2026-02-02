// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { once as onceToolkit_ } from 'es-toolkit';
import { once as onceCompatToolkit_ } from 'es-toolkit/compat';
import { once as onceLodashEs_ } from 'lodash-es';
import { once as onceArkhe_ } from '../../pithos/src/arkhe/function/once';

const onceToolkit = onceToolkit_;
const onceCompatToolkit = onceCompatToolkit_;
const onceLodashEs = onceLodashEs_;
const onceArkhe = onceArkhe_;

describe('once', () => {
  bench('es-toolkit/once', () => {
    const fn = onceToolkit(() => 42);
    fn();
    fn(); // should return cached value
    fn();
  });

  bench('es-toolkit/compat/once', () => {
    const fn = onceCompatToolkit(() => 42);
    fn();
    fn();
    fn();
  });

  bench('lodash-es/once', () => {
    const fn = onceLodashEs(() => 42);
    fn();
    fn();
    fn();
  });

  bench('arkhe/once', () => {
    const fn = onceArkhe(() => 42);
    fn();
    fn();
    fn();
  });
});
