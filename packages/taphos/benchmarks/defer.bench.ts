// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { defer as deferCompatToolkit_ } from 'es-toolkit/compat';
import { defer as deferLodashEs_ } from 'lodash-es';
import { defer as deferTaphos_ } from '../../pithos/src/taphos/function/defer';

const deferCompatToolkit = deferCompatToolkit_;
const deferLodashEs = deferLodashEs_;
const deferTaphos = deferTaphos_;

describe('defer', () => {
  bench('es-toolkit/compat/defer', () => {
    const id = deferCompatToolkit(() => {});
    clearTimeout(id);
  });

  bench('lodash-es/defer', () => {
    const id = deferLodashEs(() => {});
    clearTimeout(id);
  });

  bench('taphos/defer', () => {
    const id = deferTaphos(() => {});
    clearTimeout(id);
  });

  bench('native/defer', () => {
    const id = setTimeout(() => {}, 0);
    clearTimeout(id);
  });
});
