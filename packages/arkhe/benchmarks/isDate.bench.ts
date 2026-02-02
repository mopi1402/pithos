// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isDate as isDateToolkit_ } from 'es-toolkit';
import { isDate as isDateCompatToolkit_ } from 'es-toolkit/compat';
import { isDate as isDateLodashEs_ } from 'lodash-es';
import { isDate as isDateArkhe_ } from '../../pithos/src/arkhe/is/guard/is-date';

const isDateToolkit = isDateToolkit_;
const isDateCompatToolkit = isDateCompatToolkit_;
const isDateLodashEs = isDateLodashEs_;
const isDateArkhe = isDateArkhe_;

describe('isDate', () => {
  bench('es-toolkit/isDate', () => {
    isDateToolkit(new Date());
        isDateToolkit('2024-01-01');
        isDateToolkit({ year: 2024, month: 1, day: 1 });
  });

  bench('es-toolkit/compat/isDate', () => {
    isDateCompatToolkit(new Date());
        isDateCompatToolkit('2024-01-01');
        isDateCompatToolkit({ year: 2024, month: 1, day: 1 });
  });

  bench('lodash-es/isDate', () => {
    isDateLodashEs(new Date());
        isDateLodashEs('2024-01-01');
        isDateLodashEs({ year: 2024, month: 1, day: 1 });
  });

  bench('arkhe/isDate', () => {
    isDateArkhe(new Date());
        isDateArkhe('2024-01-01');
        isDateArkhe({ year: 2024, month: 1, day: 1 });
  });
});
