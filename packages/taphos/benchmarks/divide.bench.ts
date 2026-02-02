// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { divide as divideCompatToolkit_ } from 'es-toolkit/compat';
import { divide as divideLodashEs_ } from 'lodash-es';
import { divide as divideTaphos_ } from '../../pithos/src/taphos/math/divide';

const divideCompatToolkit = divideCompatToolkit_;
const divideLodashEs = divideLodashEs_;
const divideTaphos = divideTaphos_;

describe('divide', () => {
  bench('es-toolkit/compat/divide', () => {
    divideCompatToolkit(3, 4);
    divideCompatToolkit(-3, -4);
    divideCompatToolkit(NaN, 3);
    divideCompatToolkit(3, NaN);
    divideCompatToolkit(NaN, NaN);
  });

  bench('lodash-es/divide', () => {
    divideLodashEs(3, 4);
    divideLodashEs(-3, -4);
    divideLodashEs(NaN, 3);
    divideLodashEs(3, NaN);
    divideLodashEs(NaN, NaN);
  });

  bench('taphos/divide', () => {
    divideTaphos(3, 4);
    divideTaphos(-3, -4);
    divideTaphos(NaN, 3);
    divideTaphos(3, NaN);
    divideTaphos(NaN, NaN);
  });

  bench('native/divide', () => {
    3 / 4;
    -3 / -4;
    NaN / 3;
    3 / NaN;
    NaN / NaN;
  });
});
