// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { repeat as repeatCompatToolkit_ } from 'es-toolkit/compat';
import { repeat as repeatLodashEs_ } from 'lodash-es';
import { repeat as repeatTaphos_ } from '../../pithos/src/taphos/string/repeat';

const repeatCompatToolkit = repeatCompatToolkit_;
const repeatLodashEs = repeatLodashEs_;
const repeatTaphos = repeatTaphos_;

describe('repeat', () => {
  bench('es-toolkit/compat/repeat', () => {
    repeatCompatToolkit('abc', 2);
  });

  bench('lodash-es/repeat', () => {
    repeatLodashEs('abc', 2);
  });

  bench('taphos/repeat', () => {
    repeatTaphos('abc', 2);
  });

  bench('native/repeat', () => {
    'abc'.repeat(2);
  });
});
