// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos replace only supports string replacement, not function replacement
import { bench, describe } from 'vitest';
import { replace as replaceCompatToolkit_ } from 'es-toolkit/compat';
import { replace as replaceLodashEs_ } from 'lodash-es';
import { replace as replaceTaphos_ } from '../../pithos/src/taphos/string/replace';

const replaceCompatToolkit = replaceCompatToolkit_;
const replaceLodashEs = replaceLodashEs_;
const replaceTaphos = replaceTaphos_;

describe('replace', () => {
  bench('es-toolkit/compat/replace', () => {
    replaceCompatToolkit('abc', 'de', '123');
    replaceCompatToolkit('abc', /[bd]/g, '-');
    replaceCompatToolkit('abc', 'de', (substring: string) => substring.toUpperCase());
    replaceCompatToolkit('abc', /[bd]/g, (substring: string) => substring.toUpperCase());
  });

  bench('lodash-es/replace', () => {
    replaceLodashEs('abc', 'de', '123');
    replaceLodashEs('abc', /[bd]/g, '-');
    replaceLodashEs('abc', 'de', (substring: string) => substring.toUpperCase());
    replaceLodashEs('abc', /[bd]/g, (substring: string) => substring.toUpperCase());
  });

  bench('taphos/replace', () => {
    replaceTaphos('abc', 'de', '123');
    replaceTaphos('abc', /[bd]/g, '-');
    replaceTaphos('abc', 'de', '123');
    replaceTaphos('abc', /[bd]/g, '-');
  });

  bench('native/replace', () => {
    'abc'.replace('de', '123');
    'abc'.replace(/[bd]/g, '-');
    'abc'.replace('de', '123');
    'abc'.replace(/[bd]/g, '-');
  });
});
