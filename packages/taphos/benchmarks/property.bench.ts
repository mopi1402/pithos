// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { property as propertyCompatToolkit_ } from 'es-toolkit/compat';
import { property as propertyLodashEs_ } from 'lodash-es';
import { property as propertyTaphos_ } from '../../pithos/src/taphos/util/property';

const propertyCompatToolkit = propertyCompatToolkit_;
const propertyLodashEs = propertyLodashEs_;
const propertyTaphos = propertyTaphos_;

describe('property', () => {
  bench('es-toolkit/compat/property', () => {
    const getValue = propertyCompatToolkit('a.b');
        getValue({ 'a.b': 1, a: { b: 1 } });
  });

  bench('lodash-es/property', () => {
    const getValue = propertyLodashEs('a.b');
        getValue({ 'a.b': 1, a: { b: 1 } });
  });

  bench('taphos/property', () => {
    const getValue = propertyTaphos('a.b');
        getValue({ 'a.b': 1, a: { b: 1 } });
  });

  bench('native/property', () => {
    const key = 'a.b';
    const getValue = (obj: Record<string, unknown>) => obj[key];
    getValue({ 'a.b': 1, a: { b: 1 } });
  });
});
