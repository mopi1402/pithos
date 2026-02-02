// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos trimEnd only removes whitespace, does not support custom chars
import { bench, describe } from 'vitest';
import { trimEnd as trimEndCompatToolkit_ } from 'es-toolkit/compat';
import { trimEnd as trimEndLodashEs_ } from 'lodash-es';
import { trimEnd as trimEndTaphos_ } from '../../pithos/src/taphos/string/trimEnd';

const trimEndCompatToolkit = trimEndCompatToolkit_;
const trimEndLodashEs = trimEndLodashEs_;
const trimEndTaphos = trimEndTaphos_;

describe('trimEnd/customChars', () => {
  const str = 'kebab-case';

  bench('es-toolkit/compat/trimEnd', () => {
    trimEndCompatToolkit(str, 'se');
  });

  bench('lodash-es/trimEnd', () => {
    trimEndLodashEs(str, 'se');
  });

  // Note: taphos trimEnd does not support custom chars
});

describe('trimEnd/whitespace', () => {
  const str = '  hello world  ';

  bench('es-toolkit/compat/trimEnd', () => {
    trimEndCompatToolkit(str);
  });

  bench('lodash-es/trimEnd', () => {
    trimEndLodashEs(str);
  });

  bench('taphos/trimEnd', () => {
    trimEndTaphos(str);
  });

  bench('native/trimEnd', () => {
    str.trimEnd();
  });
});
