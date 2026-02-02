// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos trim only removes whitespace, does not support custom chars
import { bench, describe } from 'vitest';
import { trim as trimToolkit_ } from 'es-toolkit';
import { trim as trimCompatToolkit_ } from 'es-toolkit/compat';
import { trim as trimLodashEs_ } from 'lodash-es';
import { trim as trimTaphos_ } from '../../pithos/src/taphos/string/trim';

const trimToolkit = trimToolkit_;
const trimCompatToolkit = trimCompatToolkit_;
const trimLodashEs = trimLodashEs_;
const trimTaphos = trimTaphos_;

describe('trim/customChars', () => {
  const str = 'kebab-case';

  bench('es-toolkit/trim', () => {
    trimToolkit(str, ['s', 'e']);
  });

  bench('es-toolkit/compat/trim', () => {
    trimCompatToolkit(str, 'se');
  });

  bench('lodash-es/trim', () => {
    trimLodashEs(str, 'se');
  });

  // Note: taphos trim does not support custom chars
});

describe('trim/whitespace', () => {
  const str = '  hello world  ';

  bench('es-toolkit/trim', () => {
    trimToolkit(str);
  });

  bench('es-toolkit/compat/trim', () => {
    trimCompatToolkit(str);
  });

  bench('lodash-es/trim', () => {
    trimLodashEs(str);
  });

  bench('taphos/trim', () => {
    trimTaphos(str);
  });

  bench('native/trim', () => {
    str.trim();
  });
});
