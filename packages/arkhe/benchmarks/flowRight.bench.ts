// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { flowRight as flowRightToolkit_ } from 'es-toolkit';
import { flowRight as flowRightCompatToolkit_ } from 'es-toolkit/compat';
import { flowRight as flowRightLodashEs_ } from 'lodash-es';
import { flowRight as flowRightArkhe_ } from '../../pithos/src/arkhe/function/flow-right';

const flowRightToolkit = flowRightToolkit_;
const flowRightCompatToolkit = flowRightCompatToolkit_;
const flowRightLodashEs = flowRightLodashEs_;
const flowRightArkhe = flowRightArkhe_;

describe('flowRight', () => {
  const add = (x: number) => x + 1;
  const square = (n: number) => n * n;

  bench('es-toolkit/flowRight', () => {
    const combined = flowRightToolkit(add, square);
    combined(2);
  });

  bench('es-toolkit/compat/flowRight', () => {
    const combined = flowRightCompatToolkit(add, square);
    combined(2);
  });

  bench('lodash-es/flowRight', () => {
    const combined = flowRightLodashEs(add, square);
    combined(2);
  });

  bench('arkhe/flowRight', () => {
    const combined = flowRightArkhe(add, square);
    combined(2);
  });
});
