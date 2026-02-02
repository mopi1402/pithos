// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { identity as identityToolkit_ } from 'es-toolkit';
import { identity as identityLodashEs_ } from 'lodash-es';
import { identity as identityTaphos_ } from '../../pithos/src/taphos/util/identity';

const identityToolkit = identityToolkit_;
const identityLodashEs = identityLodashEs_;
const identityTaphos = identityTaphos_;

describe('identity', () => {
  const id = <T>(x: T): T => x;

  bench('es-toolkit/identity', () => {
    identityToolkit(5);
    identityToolkit('hello');
    identityToolkit({ key: 'value' });
    identityToolkit([1, 2, 3]);
    identityToolkit(true);
    identityToolkit(false);
  });

  bench('lodash-es/identity', () => {
    identityLodashEs(5);
    identityLodashEs('hello');
    identityLodashEs({ key: 'value' });
    identityLodashEs([1, 2, 3]);
    identityLodashEs(true);
    identityLodashEs(false);
  });

  bench('taphos/identity', () => {
    identityTaphos(5);
    identityTaphos('hello');
    identityTaphos({ key: 'value' });
    identityTaphos([1, 2, 3]);
    identityTaphos(true);
    identityTaphos(false);
  });

  bench('native/identity', () => {
    id(5);
    id('hello');
    id({ key: 'value' });
    id([1, 2, 3]);
    id(true);
    id(false);
  });
});
