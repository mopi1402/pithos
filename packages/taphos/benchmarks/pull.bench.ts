// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { pull as pullCompatToolkit_ } from 'es-toolkit/compat';
import { pull as pullLodashEs_ } from 'lodash-es';
import { pull as pullTaphos_ } from '../../pithos/src/taphos/array/pull';

const pullCompatToolkit = pullCompatToolkit_;
const pullLodashEs = pullLodashEs_;
const pullTaphos = pullTaphos_;

describe('pull/size100', () => {
  const array = [...Array(100)].map((_, i) => i);
  const even = [...Array(50)].map((_, i) => i * 2);

  bench('es-toolkit/compat/pull', () => {
    pullCompatToolkit([...array], ...even);
  });

  bench('lodash-es/pull', () => {
    pullLodashEs([...array], ...even);
  });

  bench('taphos/pull', () => {
    pullTaphos([...array], ...even);
  });

  bench('native/pull', () => {
    // Native immutable approach using filter with Set
    const excludeSet = new Set(even);
    [...array].filter(x => !excludeSet.has(x));
  });
});

describe('pull/size1000', () => {
  const array = [...Array(1000)].map((_, i) => i);
  const even = [...Array(500)].map((_, i) => i * 2);

  bench('es-toolkit/compat/pull', () => {
    pullCompatToolkit([...array], ...even);
  });

  bench('lodash-es/pull', () => {
    pullLodashEs([...array], ...even);
  });

  bench('taphos/pull', () => {
    pullTaphos([...array], ...even);
  });

  bench('native/pull', () => {
    const excludeSet = new Set(even);
    [...array].filter(x => !excludeSet.has(x));
  });
});

describe('pull/size10000', () => {
  const array = [...Array(10000)].map((_, i) => i);
  const even = [...Array(5000)].map((_, i) => i * 2);

  bench('es-toolkit/compat/pull', () => {
    pullCompatToolkit([...array], ...even);
  });

  bench('lodash-es/pull', () => {
    pullLodashEs([...array], ...even);
  });

  bench('taphos/pull', () => {
    pullTaphos([...array], ...even);
  });

  bench('native/pull', () => {
    const excludeSet = new Set(even);
    [...array].filter(x => !excludeSet.has(x));
  });
});
