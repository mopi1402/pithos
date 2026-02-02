// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { debounce as debounceToolkit_ } from 'es-toolkit';
import { debounce as debounceCompatToolkit_ } from 'es-toolkit/compat';
import { debounce as debounceLodashEs_ } from 'lodash-es';
import { debounce as debounceArkhe_ } from '../../pithos/src/arkhe/function/debounce';

const debounceToolkit = debounceToolkit_;
const debounceCompatToolkit = debounceCompatToolkit_;
const debounceLodashEs = debounceLodashEs_;
const debounceArkhe = debounceArkhe_;

describe('debounce', () => {
  bench('es-toolkit/debounce', () => {
    const debounced = debounceToolkit(() => 42, 1000);
    debounced();
    debounced();
    debounced();
  });

  bench('es-toolkit/compat/debounce', () => {
    const debounced = debounceCompatToolkit(() => 42, 1000);
    debounced();
    debounced();
    debounced();
  });

  bench('lodash-es/debounce', () => {
    const debounced = debounceLodashEs(() => 42, 1000);
    debounced();
    debounced();
    debounced();
  });

  bench('arkhe/debounce', () => {
    const debounced = debounceArkhe(() => 42, 1000);
    debounced();
    debounced();
    debounced();
  });
});
