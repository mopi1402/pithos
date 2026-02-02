// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { propertyOf as propertyOfCompatToolkit_ } from 'es-toolkit/compat';
import { propertyOf as propertyOfLodashEs_ } from 'lodash-es';
import { propertyOf as propertyOfTaphos_ } from '../../pithos/src/taphos/util/propertyOf';

const propertyOfCompatToolkit = propertyOfCompatToolkit_;
const propertyOfLodashEs = propertyOfLodashEs_;
const propertyOfTaphos = propertyOfTaphos_;

describe('propertyOf', () => {
  bench('es-toolkit/compat/propertyOf', () => {
    const getValue = propertyOfCompatToolkit({ 'a.b': 1, a: { b: 1 } });
        getValue('a.b');
  });

  bench('lodash-es/propertyOf', () => {
    const getValue = propertyOfLodashEs({ 'a.b': 1, a: { b: 1 } });
        getValue('a.b');
  });

  bench('taphos/propertyOf', () => {
    const getValue = propertyOfTaphos({ 'a.b': 1, a: { b: 1 } });
        getValue('a.b');
  });

  bench('native/propertyOf', () => {
    const obj = { 'a.b': 1, a: { b: 1 } } as Record<string, unknown>;
    const getValue = (key: string) => obj[key];
    getValue('a.b');
  });
});
