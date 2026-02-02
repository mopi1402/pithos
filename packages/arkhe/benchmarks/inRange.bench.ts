// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { inRange as inRangeToolkit_ } from 'es-toolkit';
import { inRange as inRangeCompatToolkit_ } from 'es-toolkit/compat';
import { inRange as inRangeLodashEs_ } from 'lodash-es';
import { inRange as inRangeArkhe_ } from '../../pithos/src/arkhe/number/in-range';

const inRangeToolkit = inRangeToolkit_;
const inRangeCompatToolkit = inRangeCompatToolkit_;
const inRangeLodashEs = inRangeLodashEs_;
const inRangeArkhe = inRangeArkhe_;

describe('inRange', () => {
  bench('es-toolkit/inRange', () => {
    inRangeToolkit(3, 5);
  });

  bench('es-toolkit/compat/inRange', () => {
    inRangeCompatToolkit(3, 5);
  });

  bench('lodash-es/inRange', () => {
    inRangeLodashEs(3, 5);
  });

  bench('arkhe/inRange', () => {
    inRangeArkhe(3, 5);
  });
});
