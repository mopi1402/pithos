// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { deburr as deburrToolkit_ } from 'es-toolkit';
import { deburr as deburrCompatToolkit_ } from 'es-toolkit/compat';
import { deburr as deburrLodashEs_ } from 'lodash-es';
import { deburr as deburrArkhe_ } from '../../pithos/src/arkhe/string/deburr';

const deburrToolkit = deburrToolkit_;
const deburrCompatToolkit = deburrCompatToolkit_;
const deburrLodashEs = deburrLodashEs_;
const deburrArkhe = deburrArkhe_;

describe('deburr', () => {
  bench('es-toolkit/deburr', () => {
    deburrToolkit('déjà vu');
  });

  bench('es-toolkit/compat/deburr', () => {
    deburrCompatToolkit('déjà vu');
  });

  bench('lodash-es/deburr', () => {
    deburrLodashEs('déjà vu');
  });

  bench('arkhe/deburr', () => {
    deburrArkhe('déjà vu');
  });
});
