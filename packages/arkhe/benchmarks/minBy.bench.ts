// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { minBy as minByToolkit_ } from 'es-toolkit';
import { minBy as minByCompatToolkit_ } from 'es-toolkit/compat';
import { minBy as minByLodashEs_ } from 'lodash-es';
import { minBy as minByArkhe_ } from '../../pithos/src/arkhe/array/min-by';

const minByToolkit = minByToolkit_;
const minByCompatToolkit = minByCompatToolkit_;
const minByLodashEs = minByLodashEs_;
const minByArkhe = minByArkhe_;

describe('minBy', () => {
  bench('es-toolkit/minBy', () => {
    const people = [
          { name: 'Mark', age: 30 },
          { name: 'Nunu', age: 20 },
          { name: 'Overmars', age: 35 },
        ];
        minByToolkit(people, person => person.age);
  });

  bench('es-toolkit/compat/minBy', () => {
    const people = [
          { name: 'Mark', age: 30 },
          { name: 'Nunu', age: 20 },
          { name: 'Overmars', age: 35 },
        ];
        minByCompatToolkit(people, person => person.age);
  });

  bench('lodash-es/minBy', () => {
    const people = [
          { name: 'Mark', age: 30 },
          { name: 'Nunu', age: 20 },
          { name: 'Overmars', age: 35 },
        ];
        minByLodashEs(people, person => person.age);
  });

  bench('arkhe/minBy', () => {
    const people = [
          { name: 'Mark', age: 30 },
          { name: 'Nunu', age: 20 },
          { name: 'Overmars', age: 35 },
        ];
        minByArkhe(people, person => person.age);
  });
});

describe('minBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ name: `name${i}`, age: i }));

  bench('es-toolkit/minBy', () => {
    minByToolkit(largeArray, person => person.age);
  });

  bench('es-toolkit/compat/minBy', () => {
    minByCompatToolkit(largeArray, person => person.age);
  });

  bench('lodash-es/minBy', () => {
    minByLodashEs(largeArray, person => person.age);
  });

  bench('arkhe/minBy', () => {
    minByArkhe(largeArray, person => person.age);
  });
});
