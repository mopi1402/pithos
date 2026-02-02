// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { unescape as unescapeToolkit_ } from 'es-toolkit';
import { unescape as unescapeCompatToolkit_ } from 'es-toolkit/compat';
import { unescape as unescapeLodashEs_ } from 'lodash-es';
import { unescape as unescapeArkhe_ } from '../../pithos/src/arkhe/string/unescape';

const unescapeToolkit = unescapeToolkit_;
const unescapeCompatToolkit = unescapeCompatToolkit_;
const unescapeLodashEs = unescapeLodashEs_;
const unescapeArkhe = unescapeArkhe_;

describe('unescape', () => {
  bench('es-toolkit/unescape', () => {
    unescapeToolkit('fred, barney, &amp; pebbles');
  });

  bench('es-toolkit/compat/unescape', () => {
    unescapeCompatToolkit('fred, barney, &amp; pebbles');
  });

  bench('lodash-es/unescape', () => {
    unescapeLodashEs('fred, barney, &amp; pebbles');
  });

  bench('arkhe/unescape', () => {
    unescapeArkhe('fred, barney, &amp; pebbles');
  });
});

describe('unescape/long', () => {
  const longString = '&lt;div&gt;Hello &amp; World&lt;/div&gt;'.repeat(100);

  bench('es-toolkit/unescape', () => {
    unescapeToolkit(longString);
  });

  bench('es-toolkit/compat/unescape', () => {
    unescapeCompatToolkit(longString);
  });

  bench('lodash-es/unescape', () => {
    unescapeLodashEs(longString);
  });

  bench('arkhe/unescape', () => {
    unescapeArkhe(longString);
  });
});
