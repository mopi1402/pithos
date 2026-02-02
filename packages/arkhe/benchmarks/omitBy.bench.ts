// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { omitBy as omitByToolkit_ } from 'es-toolkit';
import { omitBy as omitByCompatToolkit_ } from 'es-toolkit/compat';
import { omitBy as omitByLodashEs_ } from 'lodash-es';
import { omitBy as omitByArkhe_ } from '../../pithos/src/arkhe/object/omit-by';

const omitByToolkit = omitByToolkit_;
const omitByCompatToolkit = omitByCompatToolkit_;
const omitByLodashEs = omitByLodashEs_;
const omitByArkhe = omitByArkhe_;

describe('omitBy', () => {
  const obj = { a: 1, b: 'omit', c: 3, d: 'test', e: 0 };
  const shouldOmit = (value: number | string) => typeof value === 'string';

  bench('es-toolkit/omitBy', () => {
    omitByToolkit(obj, shouldOmit);
  });

  bench('es-toolkit/compat/omitBy', () => {
    omitByCompatToolkit(obj, shouldOmit);
  });

  bench('lodash-es/omitBy', () => {
    omitByLodashEs(obj, shouldOmit);
  });

  bench('arkhe/omitBy', () => {
    omitByArkhe(obj, shouldOmit);
  });
});
