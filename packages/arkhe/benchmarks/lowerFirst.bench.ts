// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { lowerFirst as lowerFirstToolkit_ } from 'es-toolkit';
import { lowerFirst as lowerFirstCompatToolkit_ } from 'es-toolkit/compat';
import { lowerFirst as lowerFirstLodashEs_ } from 'lodash-es';
import { lowerFirst as lowerFirstArkhe_ } from '../../pithos/src/arkhe/string/lowerFirst';

const lowerFirstToolkit = lowerFirstToolkit_;
const lowerFirstCompatToolkit = lowerFirstCompatToolkit_;
const lowerFirstLodashEs = lowerFirstLodashEs_;
const lowerFirstArkhe = lowerFirstArkhe_;

describe('lowerFirst', () => {
  bench('es-toolkit/lowerFirst', () => {
    const str = 'camelCase';
          lowerFirstToolkit(str);
  });

  bench('es-toolkit/compat/lowerFirst', () => {
    const str = 'camelCase';
          lowerFirstCompatToolkit(str);
  });

  bench('lodash-es/lowerFirst', () => {
    const str = 'camelCase';
          lowerFirstLodashEs(str);
  });

  bench('arkhe/lowerFirst', () => {
    const str = 'camelCase';
          lowerFirstArkhe(str);
  });
});
