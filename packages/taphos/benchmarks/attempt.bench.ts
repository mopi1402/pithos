// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { attempt as attemptCompatToolkit_ } from 'es-toolkit/compat';
import { attempt as attemptLodashEs_ } from 'lodash-es';
import { attempt as attemptTaphos_ } from '../../pithos/src/taphos/util/attempt';

const attemptCompatToolkit = attemptCompatToolkit_;
const attemptLodashEs = attemptLodashEs_;
const attemptTaphos = attemptTaphos_;

describe('attempt', () => {
  const successFn = () => 'success';
  const failFn = () => { throw new Error('fail'); };

  bench('es-toolkit/compat/attempt', () => {
    attemptCompatToolkit(successFn);
    attemptCompatToolkit(failFn);
  });

  bench('lodash-es/attempt', () => {
    attemptLodashEs(successFn);
    attemptLodashEs(failFn);
  });

  bench('taphos/attempt', () => {
    attemptTaphos(successFn);
    attemptTaphos(failFn);
  });

  bench('native/attempt', () => {
    // Native try/catch approach
    try { successFn(); } catch (e) { e instanceof Error ? e : new Error(String(e)); }
    try { failFn(); } catch (e) { e instanceof Error ? e : new Error(String(e)); }
  });
});
