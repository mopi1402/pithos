// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { memoize as memoizeToolkit_ } from 'es-toolkit';
import { memoize as memoizeCompatToolkit_ } from 'es-toolkit/compat';
import { memoize as memoizeLodashEs_ } from 'lodash-es';
import { memoize as memoizeArkhe_ } from '../../pithos/src/arkhe/function/memoize';

const memoizeToolkit = memoizeToolkit_;
const memoizeCompatToolkit = memoizeCompatToolkit_;
const memoizeLodashEs = memoizeLodashEs_;
const memoizeArkhe = memoizeArkhe_;

describe('memoize', () => {
  const object = { a: 1, b: 2, c: 3 };
  const other = { d: 4, e: 5, f: 6 };
  const values = (args: object) => {
    return Object.values(args);
  };

  bench('es-toolkit/memoize', () => {
    const memoized = memoizeToolkit(values);
        memoized(object);
        memoized(object); // cached
        memoized(other);
        memoized(other); // cached
  });

  bench('es-toolkit/compat/memoize', () => {
    const memoized = memoizeCompatToolkit(values);
        memoized(object);
        memoized(object); // cached
        memoized(other);
        memoized(other); // cached
  });

  bench('lodash-es/memoize', () => {
    const memoized = memoizeLodashEs(values);
        memoized(object);
        memoized(object); // cached
        memoized(other);
        memoized(other); // cached
  });

  bench('arkhe/memoize', () => {
    const memoized = memoizeArkhe(values);
        memoized(object);
        memoized(object); // cached
        memoized(other);
        memoized(other); // cached
  });
});
