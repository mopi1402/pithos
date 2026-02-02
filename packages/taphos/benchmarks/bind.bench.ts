// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { bind as bindCompatToolkit_ } from 'es-toolkit/compat';
import { bind as bindLodashEs_ } from 'lodash-es';
import { bind as bindTaphos_ } from '../../pithos/src/taphos/function/bind';

const bindCompatToolkit = bindCompatToolkit_;
const bindLodashEs = bindLodashEs_;
const bindTaphos = bindTaphos_;

function fn(this: unknown, ...args: unknown[]) {
  const result = [this];
  return result.concat(args);
}

describe('bind/withoutPlaceholder', () => {
  bench('es-toolkit/compat/bind', () => {
    const object = {};
    bindCompatToolkit(fn, object, 'a');
  });

  bench('lodash-es/bind', () => {
    const object = {};
    bindLodashEs(fn, object, 'a');
  });

  bench('taphos/bind', () => {
    const object = {};
    bindTaphos(fn, object, 'a');
  });

  bench('native/bind', () => {
    const object = {};
    fn.bind(object, 'a');
  });
});

describe('bind/withPlaceholder', () => {
  bench('es-toolkit/compat/bind', () => {
    const object = {};
    bindCompatToolkit(fn, object, 'a', bindCompatToolkit.placeholder);
  });

  bench('lodash-es/bind', () => {
    const object = {};
    bindLodashEs(fn, object, 'a', bindLodashEs.placeholder);
  });

  // Note: taphos bind doesn't support placeholders, using basic bind
  bench('taphos/bind', () => {
    const object = {};
    bindTaphos(fn, object, 'a');
  });

  // Note: native bind doesn't support placeholders
});
