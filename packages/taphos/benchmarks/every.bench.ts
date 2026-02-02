// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { every as everyCompatToolkit_ } from 'es-toolkit/compat';
import { every as everyLodashEs_ } from 'lodash-es';
import { every as everyTaphos_ } from '../../pithos/src/taphos/collection/every';

const everyCompatToolkit = everyCompatToolkit_;
const everyLodashEs = everyLodashEs_;
const everyTaphos = everyTaphos_;

const generateArray = (length: number, max: number) => Array.from({ length }, () => Math.floor(Math.random() * max));
const array = generateArray(10000, 1000);

describe('every/allTrue', () => {
  const alwaysTruePredicate = () => true;

  bench('es-toolkit/compat/every', () => {
    everyCompatToolkit(array, alwaysTruePredicate);
  });

  bench('lodash-es/every', () => {
    everyLodashEs(array, alwaysTruePredicate);
  });

  bench('taphos/every', () => {
    everyTaphos(array, alwaysTruePredicate);
  });

  bench('native/every', () => {
    array.every(alwaysTruePredicate);
  });
});

describe('every/allFalse', () => {
  const alwaysFalsePredicate = () => false;

  bench('es-toolkit/compat/every', () => {
    everyCompatToolkit(array, alwaysFalsePredicate);
  });

  bench('lodash-es/every', () => {
    everyLodashEs(array, alwaysFalsePredicate);
  });

  bench('taphos/every', () => {
    everyTaphos(array, alwaysFalsePredicate);
  });

  bench('native/every', () => {
    array.every(alwaysFalsePredicate);
  });
});

describe('every/failInMiddle', () => {
  const middleFailPredicate = (_n: number, index: number) => index < array.length / 2;

  bench('es-toolkit/compat/every', () => {
    everyCompatToolkit(array, middleFailPredicate);
  });

  bench('lodash-es/every', () => {
    everyLodashEs(array, middleFailPredicate);
  });

  bench('taphos/every', () => {
    everyTaphos(array, middleFailPredicate);
  });

  bench('native/every', () => {
    array.every(middleFailPredicate);
  });
});
