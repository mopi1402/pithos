// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { pad as padToolkit_ } from 'es-toolkit';
import { pad as padCompatToolkit_ } from 'es-toolkit/compat';
import { pad as padLodashEs_ } from 'lodash-es';
import { pad as padTaphos_ } from '../../pithos/src/taphos/string/pad';

const padToolkit = padToolkit_;
const padCompatToolkit = padCompatToolkit_;
const padLodashEs = padLodashEs_;
const padTaphos = padTaphos_;

describe('pad', () => {
  bench('es-toolkit/pad', () => {
    const str = 'abc';
        padToolkit(str, 6, '_-');
  });

  bench('es-toolkit/compat/pad', () => {
    const str = 'abc';
        padCompatToolkit(str, 6, '_-');
  });

  bench('lodash-es/pad', () => {
    const str = 'abc';
        padLodashEs(str, 6, '_-');
  });

  bench('taphos/pad', () => {
    const str = 'abc';
        padTaphos(str, 6, '_-');
  });

  bench('native/pad', () => {
    const str = 'abc';
    const length = 6;
    const chars = '_-';
    const padLength = Math.max(0, length - str.length);
    const leftPad = Math.floor(padLength / 2);
    const rightPad = padLength - leftPad;
    const leftStr = chars.repeat(Math.ceil(leftPad / chars.length)).slice(0, leftPad);
    const rightStr = chars.repeat(Math.ceil(rightPad / chars.length)).slice(0, rightPad);
    leftStr + str + rightStr;
  });
});
