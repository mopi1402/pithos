// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isTypedArray as isTypedArrayToolkit_ } from 'es-toolkit';
import { isTypedArray as isTypedArrayCompatToolkit_ } from 'es-toolkit/compat';
import { isTypedArray as isTypedArrayLodashEs_ } from 'lodash-es';
import { isTypedArray as isTypedArrayTaphos_ } from '../../pithos/src/taphos/lang/isTypedArray';

const isTypedArrayToolkit = isTypedArrayToolkit_;
const isTypedArrayCompatToolkit = isTypedArrayCompatToolkit_;
const isTypedArrayLodashEs = isTypedArrayLodashEs_;
const isTypedArrayTaphos = isTypedArrayTaphos_;

describe('isTypedArray', () => {
  bench('es-toolkit/isTypedArray', () => {
    isTypedArrayToolkit(new Uint8Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Uint8ClampedArray(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Uint16Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Uint32Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new BigUint64Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Int8Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Int16Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Int32Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new BigInt64Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Float32Array(new ArrayBuffer(8)));
        isTypedArrayToolkit(new Float64Array(new ArrayBuffer(8)));
  });

  bench('es-toolkit/compat/isTypedArray', () => {
    isTypedArrayCompatToolkit(new Uint8Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Uint8ClampedArray(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Uint16Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Uint32Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new BigUint64Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Int8Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Int16Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Int32Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new BigInt64Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Float32Array(new ArrayBuffer(8)));
        isTypedArrayCompatToolkit(new Float64Array(new ArrayBuffer(8)));
  });

  bench('lodash-es/isTypedArray', () => {
    isTypedArrayLodashEs(new Uint8Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Uint8ClampedArray(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Uint16Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Uint32Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new BigUint64Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Int8Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Int16Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Int32Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new BigInt64Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Float32Array(new ArrayBuffer(8)));
        isTypedArrayLodashEs(new Float64Array(new ArrayBuffer(8)));
  });

  bench('taphos/isTypedArray', () => {
    isTypedArrayTaphos(new Uint8Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Uint8ClampedArray(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Uint16Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Uint32Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new BigUint64Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Int8Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Int16Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Int32Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new BigInt64Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Float32Array(new ArrayBuffer(8)));
        isTypedArrayTaphos(new Float64Array(new ArrayBuffer(8)));
  });

  bench('native/isTypedArray', () => {
    ArrayBuffer.isView(new Uint8Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Uint8ClampedArray(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Uint16Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Uint32Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new BigUint64Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Int8Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Int16Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Int32Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new BigInt64Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Float32Array(new ArrayBuffer(8)));
    ArrayBuffer.isView(new Float64Array(new ArrayBuffer(8)));
  });
});
