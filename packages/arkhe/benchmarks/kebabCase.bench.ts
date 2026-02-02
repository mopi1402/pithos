// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { kebabCase as kebabCaseToolkit_ } from 'es-toolkit';
import { kebabCase as kebabCaseCompatToolkit_ } from 'es-toolkit/compat';
import { kebabCase as kebabCaseLodashEs_ } from 'lodash-es';
import { kebabCase as kebabCaseArkhe_ } from '../../pithos/src/arkhe/string/kebab-case';

const kebabCaseToolkit = kebabCaseToolkit_;
const kebabCaseCompatToolkit = kebabCaseCompatToolkit_;
const kebabCaseLodashEs = kebabCaseLodashEs_;
const kebabCaseArkhe = kebabCaseArkhe_;

describe('kebabCase', () => {
  bench('es-toolkit/kebabCase', () => {
    kebabCaseToolkit('hello world');
        kebabCaseToolkit('--foo--bar__baz 123');
        kebabCaseToolkit('123numericValues');
        kebabCaseToolkit('XMLHttpRequest');
        kebabCaseToolkit('hello-World_of XML_httpRequest');
  });

  bench('es-toolkit/compat/kebabCase', () => {
    kebabCaseCompatToolkit('hello world');
        kebabCaseCompatToolkit('--foo--bar__baz 123');
        kebabCaseCompatToolkit('123numericValues');
        kebabCaseCompatToolkit('XMLHttpRequest');
        kebabCaseCompatToolkit('hello-World_of XML_httpRequest');
  });

  bench('lodash-es/kebabCase', () => {
    kebabCaseLodashEs('hello world');
        kebabCaseLodashEs('--foo--bar__baz 123');
        kebabCaseLodashEs('123numericValues');
        kebabCaseLodashEs('XMLHttpRequest');
        kebabCaseLodashEs('hello-World_of XML_httpRequest');
  });

  bench('arkhe/kebabCase', () => {
    kebabCaseArkhe('hello world');
        kebabCaseArkhe('--foo--bar__baz 123');
        kebabCaseArkhe('123numericValues');
        kebabCaseArkhe('XMLHttpRequest');
        kebabCaseArkhe('hello-World_of XML_httpRequest');
  });
});
