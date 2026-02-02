// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isArrayBuffer as isArrayBufferToolkit_ } from 'es-toolkit';
import { isArrayBuffer as isArrayBufferCompatToolkit_ } from 'es-toolkit/compat';
import { isArrayBuffer as isArrayBufferLodashEs_ } from 'lodash-es';
import { isArrayBuffer as isArrayBufferArkhe_ } from '../../pithos/src/arkhe/is/guard/is-array-buffer';

const isArrayBufferToolkit = isArrayBufferToolkit_;
const isArrayBufferCompatToolkit = isArrayBufferCompatToolkit_;
const isArrayBufferLodashEs = isArrayBufferLodashEs_;
const isArrayBufferArkhe = isArrayBufferArkhe_;

describe('isArrayBuffer', () => {
  bench('es-toolkit/isArrayBuffer', () => {
    isArrayBufferToolkit(new ArrayBuffer(16));
        isArrayBufferToolkit(null);
        isArrayBufferToolkit([]);
        isArrayBufferToolkit(new Object());
        isArrayBufferToolkit(new Map());
  });

  bench('es-toolkit/compat/isArrayBuffer', () => {
    isArrayBufferCompatToolkit(new ArrayBuffer(16));
        isArrayBufferCompatToolkit(null);
        isArrayBufferCompatToolkit([]);
        isArrayBufferCompatToolkit(new Object());
        isArrayBufferCompatToolkit(new Map());
  });

  bench('lodash-es/isArrayBuffer', () => {
    isArrayBufferLodashEs(new ArrayBuffer(16));
        isArrayBufferLodashEs(null);
        isArrayBufferLodashEs([]);
        isArrayBufferLodashEs(new Object());
        isArrayBufferLodashEs(new Map());
  });

  bench('arkhe/isArrayBuffer', () => {
    isArrayBufferArkhe(new ArrayBuffer(16));
        isArrayBufferArkhe(null);
        isArrayBufferArkhe([]);
        isArrayBufferArkhe(new Object());
        isArrayBufferArkhe(new Map());
  });
});
