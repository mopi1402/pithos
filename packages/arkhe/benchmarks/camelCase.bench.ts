// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { camelCase as camelCaseToolkit_ } from 'es-toolkit';
import { camelCase as camelCaseCompatToolkit_ } from 'es-toolkit/compat';
import { camelCase as camelCaseLodashEs_ } from 'lodash-es';
import { camelCase as camelCaseArkhe_ } from '../../pithos/src/arkhe/string/camel-case';

const camelCaseToolkit = camelCaseToolkit_;
const camelCaseCompatToolkit = camelCaseCompatToolkit_;
const camelCaseLodashEs = camelCaseLodashEs_;
const camelCaseArkhe = camelCaseArkhe_;

describe('camelCase', () => {
  bench('es-toolkit/camelCase', () => {
    const str = 'kebab-case';
        camelCaseToolkit(str);
  });

  bench('es-toolkit/compat/camelCase', () => {
    const str = 'kebab-case';
        camelCaseCompatToolkit(str);
  });

  bench('lodash-es/camelCase', () => {
    const str = 'kebab-case';
        camelCaseLodashEs(str);
  });

  bench('arkhe/camelCase', () => {
    const str = 'kebab-case';
        camelCaseArkhe(str);
  });
});
