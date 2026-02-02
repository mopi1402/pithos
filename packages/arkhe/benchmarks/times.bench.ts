// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { times as timesCompatToolkit_ } from 'es-toolkit/compat';
import { times as timesLodashEs_ } from 'lodash-es';
import { times as timesArkhe_ } from '../../pithos/src/arkhe/util/times';

const timesCompatToolkit = timesCompatToolkit_;
const timesLodashEs = timesLodashEs_;
const timesArkhe = timesArkhe_;

describe('times', () => {
  bench('es-toolkit/compat/times', () => {
    timesCompatToolkit(1000, i => i * 2);
  });

  bench('lodash-es/times', () => {
    timesLodashEs(1000, i => i * 2);
  });

  bench('arkhe/times', () => {
    timesArkhe(1000, i => i * 2);
  });
});
