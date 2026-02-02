// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { capitalize as capitalizeToolkit_ } from 'es-toolkit';
import { capitalize as capitalizeCompatToolkit_ } from 'es-toolkit/compat';
import { capitalize as capitalizeLodashEs_ } from 'lodash-es';
import { capitalize as capitalizeArkhe_ } from '../../pithos/src/arkhe/string/capitalize';

const capitalizeToolkit = capitalizeToolkit_;
const capitalizeCompatToolkit = capitalizeCompatToolkit_;
const capitalizeLodashEs = capitalizeLodashEs_;
const capitalizeArkhe = capitalizeArkhe_;

describe('capitalize', () => {
  bench('es-toolkit/capitalize', () => {
    const str = 'camelCase';
        capitalizeToolkit(str);
  });

  bench('es-toolkit/compat/capitalize', () => {
    const str = 'camelCase';
        capitalizeCompatToolkit(str);
  });

  bench('lodash-es/capitalize', () => {
    const str = 'camelCase';
        capitalizeLodashEs(str);
  });

  bench('arkhe/capitalize', () => {
    const str = 'camelCase';
        capitalizeArkhe(str);
  });
});
