// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos trimStart only removes whitespace, does not support custom chars
import { bench, describe } from 'vitest';
import { trimStart as trimStartCompatToolkit_ } from 'es-toolkit/compat';
import { trimStart as trimStartLodashEs_ } from 'lodash-es';
import { trimStart as trimStartTaphos_ } from '../../pithos/src/taphos/string/trimStart';

const trimStartCompatToolkit = trimStartCompatToolkit_;
const trimStartLodashEs = trimStartLodashEs_;
const trimStartTaphos = trimStartTaphos_;

describe('trimStart/customChars', () => {
  const str = 'kebab-case';

  bench('es-toolkit/compat/trimStart', () => {
    trimStartCompatToolkit(str, 'se');
  });

  bench('lodash-es/trimStart', () => {
    trimStartLodashEs(str, 'se');
  });

  // Note: taphos trimStart does not support custom chars
});

describe('trimStart/whitespace', () => {
  const str = '  hello world  ';

  bench('es-toolkit/compat/trimStart', () => {
    trimStartCompatToolkit(str);
  });

  bench('lodash-es/trimStart', () => {
    trimStartLodashEs(str);
  });

  bench('taphos/trimStart', () => {
    trimStartTaphos(str);
  });

  bench('native/trimStart', () => {
    str.trimStart();
  });
});
