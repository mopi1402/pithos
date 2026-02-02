// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toString as toStringCompatToolkit_ } from 'es-toolkit/compat';
import { toString as toStringLodashEs_ } from 'lodash-es';
import { toString as toStringTaphos_ } from '../../pithos/src/taphos/lang/toString';

const toStringCompatToolkit = toStringCompatToolkit_;
const toStringLodashEs = toStringLodashEs_;
const toStringTaphos = toStringTaphos_;

describe('toString', () => {
  const number = -0;
  const object = Object(number);
  const char = 'a';
  const array = [number, object, char];

  bench('es-toolkit/compat/toString', () => {
    toStringCompatToolkit(number);
    toStringCompatToolkit(object);
    toStringCompatToolkit(char);
    toStringCompatToolkit(array);
  });

  bench('lodash-es/toString', () => {
    toStringLodashEs(number);
    toStringLodashEs(object);
    toStringLodashEs(char);
    toStringLodashEs(array);
  });

  bench('taphos/toString', () => {
    toStringTaphos(number);
    toStringTaphos(object);
    toStringTaphos(char);
    toStringTaphos(array);
  });

  bench('native/toString', () => {
    String(number);
    String(object);
    String(char);
    String(array);
  });
});
