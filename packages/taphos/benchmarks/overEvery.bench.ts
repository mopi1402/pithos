// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { overEvery as overEveryCompatToolkit_ } from 'es-toolkit/compat';
import { overEvery as overEveryLodashEs_ } from 'lodash-es';
import { overEvery as overEveryTaphos_ } from '../../pithos/src/taphos/util/overEvery';

const overEveryCompatToolkit = overEveryCompatToolkit_;
const overEveryLodashEs = overEveryLodashEs_;
const overEveryTaphos = overEveryTaphos_;

describe('overEvery', () => {
  bench('es-toolkit/compat/overEvery', () => {
    const overEvery = overEveryCompatToolkit([Boolean, Number.isFinite]);
        overEvery('1');
  });

  bench('lodash-es/overEvery', () => {
    const overEvery = overEveryLodashEs([Boolean, Number.isFinite]);
        overEvery('1');
  });

  bench('taphos/overEvery', () => {
    const overEvery = overEveryTaphos([Boolean, Number.isFinite]);
        overEvery('1');
  });

  bench('native/overEvery', () => {
    const predicates = [Boolean, Number.isFinite];
    const overEvery = (value: unknown) => predicates.every(fn => fn(value as never));
    overEvery('1');
  });
});
