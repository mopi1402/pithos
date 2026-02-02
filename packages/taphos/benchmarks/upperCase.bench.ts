// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { upperCase as upperCaseToolkit_ } from 'es-toolkit';
import { upperCase as upperCaseCompatToolkit_ } from 'es-toolkit/compat';
import { upperCase as upperCaseLodashEs_ } from 'lodash-es';
import { upperCase as upperCaseTaphos_ } from '../../pithos/src/taphos/string/upperCase';

const upperCaseToolkit = upperCaseToolkit_;
const upperCaseCompatToolkit = upperCaseCompatToolkit_;
const upperCaseLodashEs = upperCaseLodashEs_;
const upperCaseTaphos = upperCaseTaphos_;

describe('upperCase', () => {
  bench('es-toolkit/upperCase', () => {
    const str = 'camelCase';
          upperCaseToolkit(str);
  });

  bench('es-toolkit/compat/upperCase', () => {
    const str = 'camelCase';
          upperCaseCompatToolkit(str);
  });

  bench('lodash-es/upperCase', () => {
    const str = 'camelCase';
          upperCaseLodashEs(str);
  });

  bench('taphos/upperCase', () => {
    const str = 'camelCase';
          upperCaseTaphos(str);
  });

  bench('native/upperCase', () => {
    const str = 'camelCase';
    str.replace(/[A-Z]+/g, (match, offset) => (offset > 0 ? ' ' : '') + match.toLowerCase())
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  });
});
