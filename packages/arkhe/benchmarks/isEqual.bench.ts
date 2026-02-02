// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isEqual as isEqualToolkit_ } from 'es-toolkit';
import { isEqual as isEqualCompatToolkit_ } from 'es-toolkit/compat';
import { isEqual as isEqualLodashEs_ } from 'lodash-es';
import { isEqual as isEqualArkhe_ } from '../../pithos/src/arkhe/is/predicate/is-equal';

const isEqualToolkit = isEqualToolkit_;
const isEqualCompatToolkit = isEqualCompatToolkit_;
const isEqualLodashEs = isEqualLodashEs_;
const isEqualArkhe = isEqualArkhe_;

describe('isEqual primitives', () => {
  bench('es-toolkit/isEqual', () => {
    isEqualToolkit(1, 1);
        isEqualToolkit(NaN, NaN);
        isEqualToolkit(+0, -0);
    
        isEqualToolkit(true, true);
        isEqualToolkit(true, false);
    
        isEqualToolkit('hello', 'hello');
        isEqualToolkit('hello', 'world');
  });

  bench('es-toolkit/compat/isEqual', () => {
    isEqualCompatToolkit(1, 1);
        isEqualCompatToolkit(NaN, NaN);
        isEqualCompatToolkit(+0, -0);
    
        isEqualCompatToolkit(true, true);
        isEqualCompatToolkit(true, false);
    
        isEqualCompatToolkit('hello', 'hello');
        isEqualCompatToolkit('hello', 'world');
  });

  bench('lodash-es/isEqual', () => {
    isEqualLodashEs(1, 1);
        isEqualLodashEs(NaN, NaN);
        isEqualLodashEs(+0, -0);
    
        isEqualLodashEs(true, true);
        isEqualLodashEs(true, false);
    
        isEqualLodashEs('hello', 'hello');
        isEqualLodashEs('hello', 'world');
  });

  bench('arkhe/isEqual', () => {
    isEqualArkhe(1, 1);
        isEqualArkhe(NaN, NaN);
        isEqualArkhe(+0, -0);
    
        isEqualArkhe(true, true);
        isEqualArkhe(true, false);
    
        isEqualArkhe('hello', 'hello');
        isEqualArkhe('hello', 'world');
  });
});

describe('isEqual dates', () => {
  bench('es-toolkit/isEqual', () => {
    isEqualToolkit(new Date('2020-01-01'), new Date('2020-01-01'));
        isEqualToolkit(new Date('2020-01-01'), new Date('2021-01-01'));
  });

  bench('es-toolkit/compat/isEqual', () => {
    isEqualCompatToolkit(new Date('2020-01-01'), new Date('2020-01-01'));
        isEqualCompatToolkit(new Date('2020-01-01'), new Date('2021-01-01'));
  });

  bench('lodash-es/isEqual', () => {
    isEqualLodashEs(new Date('2020-01-01'), new Date('2020-01-01'));
        isEqualLodashEs(new Date('2020-01-01'), new Date('2021-01-01'));
  });

  bench('arkhe/isEqual', () => {
    isEqualArkhe(new Date('2020-01-01'), new Date('2020-01-01'));
        isEqualArkhe(new Date('2020-01-01'), new Date('2021-01-01'));
  });
});

describe('isEqual RegExps', () => {
  bench('es-toolkit/isEqual', () => {
    isEqualToolkit(/hello/g, /hello/g);
        isEqualToolkit(/hello/g, /hello/i);
  });

  bench('es-toolkit/compat/isEqual', () => {
    isEqualCompatToolkit(/hello/g, /hello/g);
        isEqualCompatToolkit(/hello/g, /hello/i);
  });

  bench('lodash-es/isEqual', () => {
    isEqualLodashEs(/hello/g, /hello/g);
        isEqualLodashEs(/hello/g, /hello/i);
  });

  bench('arkhe/isEqual', () => {
    isEqualArkhe(/hello/g, /hello/g);
        isEqualArkhe(/hello/g, /hello/i);
  });
});

describe('isEqual objects', () => {
  bench('es-toolkit/isEqual', () => {
    isEqualToolkit({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
        isEqualToolkit({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
        isEqualToolkit({ a: 1, b: 2 }, { a: 1, b: 2 });
  });

  bench('es-toolkit/compat/isEqual', () => {
    isEqualCompatToolkit({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
        isEqualCompatToolkit({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
        isEqualCompatToolkit({ a: 1, b: 2 }, { a: 1, b: 2 });
  });

  bench('lodash-es/isEqual', () => {
    isEqualLodashEs({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
        isEqualLodashEs({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
        isEqualLodashEs({ a: 1, b: 2 }, { a: 1, b: 2 });
  });

  bench('arkhe/isEqual', () => {
    isEqualArkhe({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
        isEqualArkhe({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
        isEqualArkhe({ a: 1, b: 2 }, { a: 1, b: 2 });
  });
});

describe('isEqual arrays', () => {
  bench('es-toolkit/isEqual', () => {
    isEqualToolkit([1, 2, 3], [1, 2, 3]);
        isEqualToolkit([1, 2, 3], [1, 2, 4]);
  });

  bench('es-toolkit/compat/isEqual', () => {
    isEqualCompatToolkit([1, 2, 3], [1, 2, 3]);
        isEqualCompatToolkit([1, 2, 3], [1, 2, 4]);
  });

  bench('lodash-es/isEqual', () => {
    isEqualLodashEs([1, 2, 3], [1, 2, 3]);
        isEqualLodashEs([1, 2, 3], [1, 2, 4]);
  });

  bench('arkhe/isEqual', () => {
    isEqualArkhe([1, 2, 3], [1, 2, 3]);
        isEqualArkhe([1, 2, 3], [1, 2, 4]);
  });
});
