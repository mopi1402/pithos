// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { snakeCase as snakeCaseToolkit_ } from 'es-toolkit';
import { snakeCase as snakeCaseCompatToolkit_ } from 'es-toolkit/compat';
import { snakeCase as snakeCaseLodashEs_ } from 'lodash-es';
import { snakeCase as snakeCaseArkhe_ } from '../../pithos/src/arkhe/string/snake-case';

const snakeCaseToolkit = snakeCaseToolkit_;
const snakeCaseCompatToolkit = snakeCaseCompatToolkit_;
const snakeCaseLodashEs = snakeCaseLodashEs_;
const snakeCaseArkhe = snakeCaseArkhe_;

describe('snakeCase', () => {
  bench('es-toolkit/snakeCase', () => {
    snakeCaseToolkit('hello world');
        snakeCaseToolkit('--foo--bar__baz 123');
        snakeCaseToolkit('123numericValues');
        snakeCaseToolkit('XMLHttpRequest');
        snakeCaseToolkit('hello-World_of XML_httpRequest');
  });

  bench('es-toolkit/compat/snakeCase', () => {
    snakeCaseCompatToolkit('hello world');
        snakeCaseCompatToolkit('--foo--bar__baz 123');
        snakeCaseCompatToolkit('123numericValues');
        snakeCaseCompatToolkit('XMLHttpRequest');
        snakeCaseCompatToolkit('hello-World_of XML_httpRequest');
  });

  bench('lodash-es/snakeCase', () => {
    snakeCaseLodashEs('hello world');
        snakeCaseLodashEs('--foo--bar__baz 123');
        snakeCaseLodashEs('123numericValues');
        snakeCaseLodashEs('XMLHttpRequest');
        snakeCaseLodashEs('hello-World_of XML_httpRequest');
  });

  bench('arkhe/snakeCase', () => {
    snakeCaseArkhe('hello world');
        snakeCaseArkhe('--foo--bar__baz 123');
        snakeCaseArkhe('123numericValues');
        snakeCaseArkhe('XMLHttpRequest');
        snakeCaseArkhe('hello-World_of XML_httpRequest');
  });
});
