// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isMap as isMapToolkit_ } from 'es-toolkit';
import { isMap as isMapCompatToolkit_ } from 'es-toolkit/compat';
import { isMap as isMapLodashEs_ } from 'lodash-es';
import { isMap as isMapArkhe_ } from '../../pithos/src/arkhe/is/guard/is-map';

const isMapToolkit = isMapToolkit_;
const isMapCompatToolkit = isMapCompatToolkit_;
const isMapLodashEs = isMapLodashEs_;
const isMapArkhe = isMapArkhe_;

describe('isMap', () => {
  bench('es-toolkit/isMap', () => {
    isMapToolkit(new Map());
        isMapToolkit(new Map([['key', 'value']]));
        isMapToolkit(new WeakMap());
        isMapToolkit([]);
        isMapToolkit({});
        isMapToolkit(null);
  });

  bench('es-toolkit/compat/isMap', () => {
    isMapCompatToolkit(new Map());
        isMapCompatToolkit(new Map([['key', 'value']]));
        isMapCompatToolkit(new WeakMap());
        isMapCompatToolkit([]);
        isMapCompatToolkit({});
        isMapCompatToolkit(null);
  });

  bench('lodash-es/isMap', () => {
    isMapLodashEs(new Map());
        isMapLodashEs(new Map([['key', 'value']]));
        isMapLodashEs(new WeakMap());
        isMapLodashEs([]);
        isMapLodashEs({});
        isMapLodashEs(null);
  });

  bench('arkhe/isMap', () => {
    isMapArkhe(new Map());
        isMapArkhe(new Map([['key', 'value']]));
        isMapArkhe(new WeakMap());
        isMapArkhe([]);
        isMapArkhe({});
        isMapArkhe(null);
  });
});
