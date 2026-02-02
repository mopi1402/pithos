// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isWeakSet as isWeakSetToolkit_ } from 'es-toolkit';
import { isWeakSet as isWeakSetCompatToolkit_ } from 'es-toolkit/compat';
import { isWeakSet as isWeakSetLodashEs_ } from 'lodash-es';
import { isWeakSet as isWeakSetTaphos_ } from '../../pithos/src/taphos/lang/isWeakSet';

const isWeakSetToolkit = isWeakSetToolkit_;
const isWeakSetCompatToolkit = isWeakSetCompatToolkit_;
const isWeakSetLodashEs = isWeakSetLodashEs_;
const isWeakSetTaphos = isWeakSetTaphos_;

describe('isWeakSet', () => {
  bench('es-toolkit/isWeakSet', () => {
    isWeakSetToolkit(new WeakMap());
        isWeakSetToolkit(new Map());
        isWeakSetToolkit('');
        isWeakSetToolkit(123);
  });

  bench('es-toolkit/compat/isWeakSet', () => {
    isWeakSetCompatToolkit(new WeakMap());
        isWeakSetCompatToolkit(new Map());
        isWeakSetCompatToolkit('');
        isWeakSetCompatToolkit(123);
  });

  bench('lodash-es/isWeakSet', () => {
    isWeakSetLodashEs(new WeakMap());
        isWeakSetLodashEs(new Map());
        isWeakSetLodashEs('');
        isWeakSetLodashEs(123);
  });

  bench('taphos/isWeakSet', () => {
    isWeakSetTaphos(new WeakMap());
        isWeakSetTaphos(new Map());
        isWeakSetTaphos('');
        isWeakSetTaphos(123);
  });

  bench('native/isWeakSet', () => {
    new WeakMap() instanceof WeakSet;
    new Map() instanceof WeakSet;
    ('' as unknown) instanceof WeakSet;
    (123 as unknown) instanceof WeakSet;
  });
});
