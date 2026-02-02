// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
// Note: taphos overSome takes an array of predicates, not variadic arguments
import { bench, describe } from 'vitest';
import { overSome as overSomeCompatToolkit_ } from 'es-toolkit/compat';
import { overSome as overSomeLodashEs_ } from 'lodash-es';
import { overSome as overSomeTaphos_ } from '../../pithos/src/taphos/util/overSome';

const overSomeCompatToolkit = overSomeCompatToolkit_;
const overSomeLodashEs = overSomeLodashEs_;
const overSomeTaphos = overSomeTaphos_;

describe('overSome', () => {
  bench('es-toolkit/compat/overSome', () => {
    const isValid = overSomeCompatToolkit(
      (value: unknown) => typeof value === 'string',
      (value: unknown) => typeof value === 'number'
    );
    isValid(1);
  });

  bench('lodash-es/overSome', () => {
    const isValid = overSomeLodashEs(
      (value: unknown) => typeof value === 'string',
      (value: unknown) => typeof value === 'number'
    );
    isValid(1);
  });

  bench('taphos/overSome', () => {
    const isValid = overSomeTaphos([
      (value: unknown) => typeof value === 'string',
      (value: unknown) => typeof value === 'number'
    ]);
    isValid(1);
  });

  bench('native/overSome', () => {
    const predicates = [
      (value: unknown) => typeof value === 'string',
      (value: unknown) => typeof value === 'number'
    ];
    const isValid = (value: unknown) => predicates.some(fn => fn(value));
    isValid(1);
  });
});
