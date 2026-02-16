// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { lowerCase as lowerCaseToolkit_ } from 'es-toolkit';
import { lowerCase as lowerCaseCompatToolkit_ } from 'es-toolkit/compat';
import { lowerCase as lowerCaseLodashEs_ } from 'lodash-es';
import { lowerCase as lowerCaseArkhe_ } from '../../pithos/src/arkhe/string/lower-case';

const lowerCaseToolkit = lowerCaseToolkit_;
const lowerCaseCompatToolkit = lowerCaseCompatToolkit_;
const lowerCaseLodashEs = lowerCaseLodashEs_;
const lowerCaseArkhe = lowerCaseArkhe_;

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

  bench('arkhe/lowerCase', () => {
    lowerCaseArkhe(str);
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

  bench('arkhe/lowerCase', () => {
    lowerCaseArkhe(LONG_STR);
  });
});

describe('lowerCase/emoji', () => {
  const str = 'hello🚀World_FOO-bar🎉Test';

  bench('es-toolkit/lowerCase', () => {
    lowerCaseToolkit(str);
  });

  bench('es-toolkit/compat/lowerCase', () => {
    lowerCaseCompatToolkit(str);
  });

  bench('lodash-es/lowerCase', () => {
    lowerCaseLodashEs(str);
  });

  bench('arkhe/lowerCase', () => {
    lowerCaseArkhe(str);
  });
});
