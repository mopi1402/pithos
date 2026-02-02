// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isWeakMap as isWeakMapToolkit_ } from 'es-toolkit';
import { isWeakMap as isWeakMapCompatToolkit_ } from 'es-toolkit/compat';
import { isWeakMap as isWeakMapLodashEs_ } from 'lodash-es';
import { isWeakMap as isWeakMapTaphos_ } from '../../pithos/src/taphos/lang/isWeakMap';

const isWeakMapToolkit = isWeakMapToolkit_;
const isWeakMapCompatToolkit = isWeakMapCompatToolkit_;
const isWeakMapLodashEs = isWeakMapLodashEs_;
const isWeakMapTaphos = isWeakMapTaphos_;

describe('isWeakMap', () => {
  bench('es-toolkit/isWeakMap', () => {
    isWeakMapToolkit(new WeakMap());
        isWeakMapToolkit(new Map());
        isWeakMapToolkit('');
        isWeakMapToolkit(123);
  });

  bench('es-toolkit/compat/isWeakMap', () => {
    isWeakMapCompatToolkit(new WeakMap());
        isWeakMapCompatToolkit(new Map());
        isWeakMapCompatToolkit('');
        isWeakMapCompatToolkit(123);
  });

  bench('lodash-es/isWeakMap', () => {
    isWeakMapLodashEs(new WeakMap());
        isWeakMapLodashEs(new Map());
        isWeakMapLodashEs('');
        isWeakMapLodashEs(123);
  });

  bench('taphos/isWeakMap', () => {
    isWeakMapTaphos(new WeakMap());
        isWeakMapTaphos(new Map());
        isWeakMapTaphos('');
        isWeakMapTaphos(123);
  });

  bench('native/isWeakMap', () => {
    new WeakMap() instanceof WeakMap;
    new Map() instanceof WeakMap;
    ('' as unknown) instanceof WeakMap;
    (123 as unknown) instanceof WeakMap;
  });
});
