// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { escape as escapeToolkit_ } from 'es-toolkit';
import { escape as escapeCompatToolkit_ } from 'es-toolkit/compat';
import { escape as escapeLodashEs_ } from 'lodash-es';
import { escape as escapeArkhe_ } from '../../pithos/src/arkhe/string/escape';

const escapeToolkit = escapeToolkit_;
const escapeCompatToolkit = escapeCompatToolkit_;
const escapeLodashEs = escapeLodashEs_;
const escapeArkhe = escapeArkhe_;

describe('escape', () => {
  bench('es-toolkit/escape', () => {
    escapeToolkit('fred, barney, & pebbles');
  });

  bench('es-toolkit/compat/escape', () => {
    escapeCompatToolkit('fred, barney, & pebbles');
  });

  bench('lodash-es/escape', () => {
    escapeLodashEs('fred, barney, & pebbles');
  });

  bench('arkhe/escape', () => {
    escapeArkhe('fred, barney, & pebbles');
  });
});

describe('escape/longString', () => {
  const longString = 'fred, barney, & pebbles'.repeat(100);

  bench('es-toolkit/escape', () => {
    escapeToolkit(longString);
  });

  bench('es-toolkit/compat/escape', () => {
    escapeCompatToolkit(longString);
  });

  bench('lodash-es/escape', () => {
    escapeLodashEs(longString);
  });

  bench('arkhe/escape', () => {
    escapeArkhe(longString);
  });
});
