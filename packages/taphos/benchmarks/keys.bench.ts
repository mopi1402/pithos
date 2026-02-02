// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { keys as keysCompatToolkit_ } from 'es-toolkit/compat';
import { keys as keysLodashEs_ } from 'lodash-es';
import { keys as keysTaphos_ } from '../../pithos/src/taphos/object/keys';

const keysCompatToolkit = keysCompatToolkit_;
const keysLodashEs = keysLodashEs_;
const keysTaphos = keysTaphos_;

class Foo {
  a = 1;
  b = 2;
  c = 3;
}

const object = new Foo();

describe('keys', () => {
  bench('es-toolkit/compat/keys', () => {
    keysCompatToolkit(object);
  });

  bench('lodash-es/keys', () => {
    keysLodashEs(object);
  });

  bench('taphos/keys', () => {
    keysTaphos(object);
  });

  bench('native/keys', () => {
    Object.keys(object);
  });
});
