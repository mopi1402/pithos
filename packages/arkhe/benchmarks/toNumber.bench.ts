// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { toNumber as toNumberCompatToolkit_ } from 'es-toolkit/compat';
import { toNumber as toNumberLodashEs_ } from 'lodash-es';
import { toNumber as toNumberArkhe_ } from '../../pithos/src/arkhe/number/to-number';

const toNumberCompatToolkit = toNumberCompatToolkit_;
const toNumberLodashEs = toNumberLodashEs_;
const toNumberArkhe = toNumberArkhe_;

describe('toNumber', () => {
  bench('es-toolkit/compat/toNumber', () => {
    toNumberCompatToolkit({ valueOf: () => 1 });
        toNumberCompatToolkit({ valueOf: () => 2 });
        toNumberCompatToolkit({ toString: () => '3' });
        toNumberCompatToolkit('0b101010');
        toNumberCompatToolkit('0o12345');
        toNumberCompatToolkit('0x1a2b3c');
        toNumberCompatToolkit('1.1');
  });

  bench('lodash-es/toNumber', () => {
    toNumberLodashEs({ valueOf: () => 1 });
        toNumberLodashEs({ valueOf: () => 2 });
        toNumberLodashEs({ toString: () => '3' });
        toNumberLodashEs('0b101010');
        toNumberLodashEs('0o12345');
        toNumberLodashEs('0x1a2b3c');
        toNumberLodashEs('1.1');
  });

  bench('arkhe/toNumber', () => {
    toNumberArkhe({ valueOf: () => 1 });
        toNumberArkhe({ valueOf: () => 2 });
        toNumberArkhe({ toString: () => '3' });
        toNumberArkhe('0b101010');
        toNumberArkhe('0o12345');
        toNumberArkhe('0x1a2b3c');
        toNumberArkhe('1.1');
  });
});
