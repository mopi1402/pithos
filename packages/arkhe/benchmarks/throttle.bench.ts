// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { throttle as throttleToolkit_ } from 'es-toolkit';
import { throttle as throttleCompatToolkit_ } from 'es-toolkit/compat';
import { throttle as throttleLodashEs_ } from 'lodash-es';
import { throttle as throttleArkhe_ } from '../../pithos/src/arkhe/function/throttle';

const throttleToolkit = throttleToolkit_;
const throttleCompatToolkit = throttleCompatToolkit_;
const throttleLodashEs = throttleLodashEs_;
const throttleArkhe = throttleArkhe_;

describe('throttle', () => {
  bench('es-toolkit/throttle', () => {
    const throttled = throttleToolkit(() => 42, 1000);
    throttled();
    throttled();
    throttled();
  });

  bench('es-toolkit/compat/throttle', () => {
    const throttled = throttleCompatToolkit(() => 42, 1000);
    throttled();
    throttled();
    throttled();
  });

  bench('lodash-es/throttle', () => {
    const throttled = throttleLodashEs(() => 42, 1000);
    throttled();
    throttled();
    throttled();
  });

  bench('arkhe/throttle', () => {
    const throttled = throttleArkhe(() => 42, 1000);
    throttled();
    throttled();
    throttled();
  });
});
