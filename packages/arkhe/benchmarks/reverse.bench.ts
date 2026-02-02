// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { reverse as reverseCompatToolkit_ } from 'es-toolkit/compat';
import { reverse as reverseLodashEs_ } from 'lodash-es';
import { reverse as reverseArkhe_ } from '../../pithos/src/arkhe/array/reverse';

const reverseCompatToolkit = reverseCompatToolkit_;
const reverseLodashEs = reverseLodashEs_;
const reverseArkhe = reverseArkhe_;

const testArray = Array.from({ length: 1000 }, (_, i) => i);

describe('reverse', () => {
  bench('es-toolkit/compat/reverse', () => {
    const arrayCopy = [...testArray];
    reverseCompatToolkit(arrayCopy);
  });

  bench('lodash-es/reverse', () => {
    const arrayCopy = [...testArray];
    reverseLodashEs(arrayCopy);
  });

  bench('arkhe/reverse', () => {
    const arrayCopy = [...testArray];
    reverseArkhe(arrayCopy);
  });
});
