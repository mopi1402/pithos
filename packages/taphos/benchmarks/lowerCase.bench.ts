// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { lowerCase as lowerCaseToolkit_ } from 'es-toolkit';
import { lowerCase as lowerCaseCompatToolkit_ } from 'es-toolkit/compat';
import { lowerCase as lowerCaseLodashEs_ } from 'lodash-es';
import { lowerCase as lowerCaseTaphos_ } from '../../pithos/src/taphos/string/lowerCase';

const lowerCaseToolkit = lowerCaseToolkit_;
const lowerCaseCompatToolkit = lowerCaseCompatToolkit_;
const lowerCaseLodashEs = lowerCaseLodashEs_;
const lowerCaseTaphos = lowerCaseTaphos_;

describe('lowerCase/shortString', () => {
  const str = 'camelCase';

  bench('es-toolkit/lowerCase', () => {
    lowerCaseToolkit(str);
  });

  bench('es-toolkit/compat/lowerCase', () => {
    lowerCaseCompatToolkit(str);
  });

  bench('lodash-es/lowerCase', () => {
    lowerCaseLodashEs(str);
  });

  bench('taphos/lowerCase', () => {
    lowerCaseTaphos(str);
  });

  // Note: native toLowerCase doesn't split words
  bench('native/lowerCase', () => {
    str.toLowerCase();
  });
});

describe('lowerCase/longString', () => {
  const LONG_STR = 'camelCaseLongString'.repeat(1000);

  bench('es-toolkit/lowerCase', () => {
    lowerCaseToolkit(LONG_STR);
  });

  bench('es-toolkit/compat/lowerCase', () => {
    lowerCaseCompatToolkit(LONG_STR);
  });

  bench('lodash-es/lowerCase', () => {
    lowerCaseLodashEs(LONG_STR);
  });

  bench('taphos/lowerCase', () => {
    lowerCaseTaphos(LONG_STR);
  });

  // Note: native toLowerCase doesn't split words
  bench('native/lowerCase', () => {
    LONG_STR.toLowerCase();
  });
});
