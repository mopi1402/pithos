// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { upperCase as upperCaseToolkit_ } from 'es-toolkit';
import { upperCase as upperCaseCompatToolkit_ } from 'es-toolkit/compat';
import { upperCase as upperCaseLodashEs_ } from 'lodash-es';
import { upperCase as upperCaseArkhe_ } from '../../pithos/src/arkhe/string/upper-case';

const upperCaseToolkit = upperCaseToolkit_;
const upperCaseCompatToolkit = upperCaseCompatToolkit_;
const upperCaseLodashEs = upperCaseLodashEs_;
const upperCaseArkhe = upperCaseArkhe_;

describe('upperCase/shortString', () => {
  const str = 'camelCase';

  bench('es-toolkit/upperCase', () => {
    upperCaseToolkit(str);
  });

  bench('es-toolkit/compat/upperCase', () => {
    upperCaseCompatToolkit(str);
  });

  bench('lodash-es/upperCase', () => {
    upperCaseLodashEs(str);
  });

  bench('arkhe/upperCase', () => {
    upperCaseArkhe(str);
  });
});

describe('upperCase/longString', () => {
  const LONG_STR = 'camelCaseLongString'.repeat(1000);

  bench('es-toolkit/upperCase', () => {
    upperCaseToolkit(LONG_STR);
  });

  bench('es-toolkit/compat/upperCase', () => {
    upperCaseCompatToolkit(LONG_STR);
  });

  bench('lodash-es/upperCase', () => {
    upperCaseLodashEs(LONG_STR);
  });

  bench('arkhe/upperCase', () => {
    upperCaseArkhe(LONG_STR);
  });
});

describe('upperCase/emoji', () => {
  const str = 'hello🚀World_FOO-bar🎉Test';

  bench('es-toolkit/upperCase', () => {
    upperCaseToolkit(str);
  });

  bench('es-toolkit/compat/upperCase', () => {
    upperCaseCompatToolkit(str);
  });

  bench('lodash-es/upperCase', () => {
    upperCaseLodashEs(str);
  });

  bench('arkhe/upperCase', () => {
    upperCaseArkhe(str);
  });
});
