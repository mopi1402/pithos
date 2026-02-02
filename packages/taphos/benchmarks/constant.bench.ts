// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// FIXED: Original benchmark only tested function creation, not invocation
import { bench, describe } from 'vitest';
import { constant as constantCompatToolkit_ } from 'es-toolkit/compat';
import { constant as constantLodashEs_ } from 'lodash-es';
import { constant as constantTaphos_ } from '../../pithos/src/taphos/util/constant';

const constantCompatToolkit = constantCompatToolkit_;
const constantLodashEs = constantLodashEs_;
const constantTaphos = constantTaphos_;

describe('constant', () => {
  bench('es-toolkit/compat/constant', () => {
    const fn = constantCompatToolkit([1, 2, 3]);
    fn();
    fn();
    fn();
  });

  bench('lodash-es/constant', () => {
    const fn = constantLodashEs([1, 2, 3]);
    fn();
    fn();
    fn();
  });

  bench('taphos/constant', () => {
    const fn = constantTaphos([1, 2, 3]);
    fn();
    fn();
    fn();
  });

  bench('native/constant', () => {
    const value = [1, 2, 3];
    const fn = () => value;
    fn();
    fn();
    fn();
  });
});
