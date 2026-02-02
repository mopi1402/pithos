// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { endsWith as endsWithCompatToolkit_ } from 'es-toolkit/compat';
import { endsWith as endsWithLodashEs_ } from 'lodash-es';
import { endsWith as endsWithTaphos_ } from '../../pithos/src/taphos/string/endsWith';

const endsWithCompatToolkit = endsWithCompatToolkit_;
const endsWithLodashEs = endsWithLodashEs_;
const endsWithTaphos = endsWithTaphos_;

describe('endsWith', () => {
  const str = 'fooBar';

  bench('es-toolkit/compat/endsWith', () => {
    endsWithCompatToolkit(str, 'Bar');
    endsWithCompatToolkit(str, 'foo', 3);
  });

  bench('lodash-es/endsWith', () => {
    endsWithLodashEs(str, 'Bar');
    endsWithLodashEs(str, 'foo', 3);
  });

  bench('taphos/endsWith', () => {
    endsWithTaphos(str, 'Bar');
    endsWithTaphos(str, 'foo', 3);
  });

  bench('native/endsWith', () => {
    str.endsWith('Bar');
    str.endsWith('foo', 3);
  });
});
