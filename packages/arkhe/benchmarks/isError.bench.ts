// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isError as isErrorToolkit_ } from 'es-toolkit';
import { isError as isErrorCompatToolkit_ } from 'es-toolkit/compat';
import { isError as isErrorLodashEs_ } from 'lodash-es';
import { isError as isErrorArkhe_ } from '../../pithos/src/arkhe/is/guard/is-error';

const isErrorToolkit = isErrorToolkit_;
const isErrorCompatToolkit = isErrorCompatToolkit_;
const isErrorLodashEs = isErrorLodashEs_;
const isErrorArkhe = isErrorArkhe_;

describe('isError', () => {
  bench('es-toolkit/isError', () => {
    isErrorToolkit(new Error());
        isErrorToolkit(1);
        isErrorToolkit('Error');
        isErrorToolkit({ name: 'Error', message: '' });
  });

  bench('es-toolkit/compat/isError', () => {
    isErrorCompatToolkit(new Error());
        isErrorCompatToolkit(1);
        isErrorCompatToolkit('Error');
        isErrorCompatToolkit({ name: 'Error', message: '' });
  });

  bench('lodash-es/isError', () => {
    isErrorLodashEs(new Error());
        isErrorLodashEs(1);
        isErrorLodashEs('Error');
        isErrorLodashEs({ name: 'Error', message: '' });
  });

  bench('arkhe/isError', () => {
    isErrorArkhe(new Error());
        isErrorArkhe(1);
        isErrorArkhe('Error');
        isErrorArkhe({ name: 'Error', message: '' });
  });
});
