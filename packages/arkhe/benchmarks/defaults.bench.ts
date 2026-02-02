// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { defaults as defaultsCompatToolkit_ } from 'es-toolkit/compat';
import { defaults as defaultsLodashEs_ } from 'lodash-es';
import { defaults as defaultsArkhe_ } from '../../pithos/src/arkhe/object/defaults';

const defaultsCompatToolkit = defaultsCompatToolkit_;
const defaultsLodashEs = defaultsLodashEs_;
const defaultsArkhe = defaultsArkhe_;

describe('defaults', () => {
  bench('es-toolkit/compat/defaults', () => {
    defaultsCompatToolkit({ a: 1 }, { a: 2, b: 2 });
        defaultsCompatToolkit({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });

  bench('lodash-es/defaults', () => {
    defaultsLodashEs({ a: 1 }, { a: 2, b: 2 });
        defaultsLodashEs({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });

  bench('arkhe/defaults', () => {
    defaultsArkhe({ a: 1 }, { a: 2, b: 2 });
        defaultsArkhe({ a: 1, b: 2 }, { b: 3 }, { c: 3 });
  });
});
