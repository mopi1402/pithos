// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { noop as noopToolkit_ } from 'es-toolkit';
import { noop as noopLodashEs_ } from 'lodash-es';
import { noop as noopArkhe_ } from '../../pithos/src/arkhe/function/noop';

const noopToolkit = noopToolkit_;
const noopLodashEs = noopLodashEs_;
const noopArkhe = noopArkhe_;

describe('noop', () => {
  bench('es-toolkit/noop', () => {
    noopToolkit();
  });

  bench('lodash-es/noop', () => {
    noopLodashEs();
  });

  bench('arkhe/noop', () => {
    noopArkhe();
  });
});
