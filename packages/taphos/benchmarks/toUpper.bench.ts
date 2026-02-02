// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toUpper as toUpperCompatToolkit_ } from 'es-toolkit/compat';
import { toUpper as toUpperLodashEs_ } from 'lodash-es';
import { toUpper as toUpperTaphos_ } from '../../pithos/src/taphos/string/toUpper';

const toUpperCompatToolkit = toUpperCompatToolkit_;
const toUpperLodashEs = toUpperLodashEs_;
const toUpperTaphos = toUpperTaphos_;

describe('toUpper', () => {
  const basicStrings = ['foo bar', 'Foo bar', 'foo Bar', 'Foo Bar', 'FOO BAR', 'fooBar', '--foo-bar--', '__foo_bar__'];

  bench('es-toolkit/compat/toUpper', () => {
    basicStrings.forEach(str => toUpperCompatToolkit(str));
  });

  bench('lodash-es/toUpper', () => {
    basicStrings.forEach(str => toUpperLodashEs(str));
  });

  bench('taphos/toUpper', () => {
    basicStrings.forEach(str => toUpperTaphos(str));
  });

  bench('native/toUpper', () => {
    basicStrings.forEach(str => str.toUpperCase());
  });
});
