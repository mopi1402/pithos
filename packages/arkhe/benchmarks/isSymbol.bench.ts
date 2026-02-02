// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { isSymbol as isSymbolToolkit_ } from 'es-toolkit';
import { isSymbol as isSymbolCompatToolkit_ } from 'es-toolkit/compat';
import { isSymbol as isSymbolLodashEs_ } from 'lodash-es';
import { isSymbol as isSymbolArkhe_ } from '../../pithos/src/arkhe/is/guard/is-symbol';

const isSymbolToolkit = isSymbolToolkit_;
const isSymbolCompatToolkit = isSymbolCompatToolkit_;
const isSymbolLodashEs = isSymbolLodashEs_;
const isSymbolArkhe = isSymbolArkhe_;

describe('isSymbol', () => {
  bench('es-toolkit/isSymbol', () => {
    isSymbolToolkit(Symbol('a'));
        isSymbolToolkit(Symbol.for('a'));
        isSymbolToolkit(Symbol.iterator);
        isSymbolToolkit('');
        isSymbolToolkit({});
        isSymbolToolkit(123);
  });

  bench('es-toolkit/compat/isSymbol', () => {
    isSymbolCompatToolkit(Symbol('a'));
        isSymbolCompatToolkit(Symbol.for('a'));
        isSymbolCompatToolkit(Symbol.iterator);
        isSymbolCompatToolkit('');
        isSymbolCompatToolkit({});
        isSymbolCompatToolkit(123);
  });

  bench('lodash-es/isSymbol', () => {
    isSymbolLodashEs(Symbol('a'));
        isSymbolLodashEs(Symbol.for('a'));
        isSymbolLodashEs(Symbol.iterator);
        isSymbolLodashEs('');
        isSymbolLodashEs({});
        isSymbolLodashEs(123);
  });

  bench('arkhe/isSymbol', () => {
    isSymbolArkhe(Symbol('a'));
        isSymbolArkhe(Symbol.for('a'));
        isSymbolArkhe(Symbol.iterator);
        isSymbolArkhe('');
        isSymbolArkhe({});
        isSymbolArkhe(123);
  });
});
