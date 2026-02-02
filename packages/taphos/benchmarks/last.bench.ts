// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { last as lastToolkit_ } from 'es-toolkit';
import { last as lastCompatToolkit_ } from 'es-toolkit/compat';
import { last as lastLodashEs_ } from 'lodash-es';
import { last as lastTaphos_ } from '../../pithos/src/taphos/array/last';

const lastToolkit = lastToolkit_;
const lastCompatToolkit = lastCompatToolkit_;
const lastLodashEs = lastLodashEs_;
const lastTaphos = lastTaphos_;

describe('last', () => {
  const people = [
    { name: 'mike', age: 20 },
    { name: 'jake', age: 30 },
    { name: 'john', age: 25 },
    { name: 'sarah', age: 25 },
    { name: 'emma', age: 25 },
  ];

  bench('es-toolkit/last', () => {
    lastToolkit(people);
  });

  bench('es-toolkit/compat/last', () => {
    lastCompatToolkit(people);
  });

  bench('lodash-es/last', () => {
    lastLodashEs(people);
  });

  bench('taphos/last', () => {
    lastTaphos(people);
  });

  bench('native/last', () => {
    people[people.length - 1];
  });
});

describe('last/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ name: `name${i}`, age: i }));

  bench('es-toolkit/last', () => {
    lastToolkit(largeArray);
  });

  bench('es-toolkit/compat/last', () => {
    lastCompatToolkit(largeArray);
  });

  bench('lodash-es/last', () => {
    lastLodashEs(largeArray);
  });

  bench('taphos/last', () => {
    lastTaphos(largeArray);
  });

  bench('native/last', () => {
    largeArray[largeArray.length - 1];
  });
});
