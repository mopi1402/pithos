// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { maxBy as maxByToolkit_ } from 'es-toolkit';
import { maxBy as maxByCompatToolkit_ } from 'es-toolkit/compat';
import { maxBy as maxByLodashEs_ } from 'lodash-es';
import { maxBy as maxByArkhe_ } from '../../pithos/src/arkhe/array/max-by';

const maxByToolkit = maxByToolkit_;
const maxByCompatToolkit = maxByCompatToolkit_;
const maxByLodashEs = maxByLodashEs_;
const maxByArkhe = maxByArkhe_;

describe('maxBy', () => {
  bench('es-toolkit/maxBy', () => {
    const people = [
          { name: 'Mark', age: 25 },
          { name: 'Nunu', age: 30 },
          { name: 'Overmars', age: 20 },
        ];
        maxByToolkit(people, person => person.age);
  });

  bench('es-toolkit/compat/maxBy', () => {
    const people = [
          { name: 'Mark', age: 25 },
          { name: 'Nunu', age: 30 },
          { name: 'Overmars', age: 20 },
        ];
        maxByCompatToolkit(people, person => person.age);
  });

  bench('lodash-es/maxBy', () => {
    const people = [
          { name: 'Mark', age: 25 },
          { name: 'Nunu', age: 30 },
          { name: 'Overmars', age: 20 },
        ];
        maxByLodashEs(people, person => person.age);
  });

  bench('arkhe/maxBy', () => {
    const people = [
          { name: 'Mark', age: 25 },
          { name: 'Nunu', age: 30 },
          { name: 'Overmars', age: 20 },
        ];
        maxByArkhe(people, person => person.age);
  });
});

describe('maxBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ name: `name${i}`, age: i }));

  bench('es-toolkit/maxBy', () => {
    maxByToolkit(largeArray, person => person.age);
  });

  bench('es-toolkit/compat/maxBy', () => {
    maxByCompatToolkit(largeArray, person => person.age);
  });

  bench('lodash-es/maxBy', () => {
    maxByLodashEs(largeArray, person => person.age);
  });

  bench('arkhe/maxBy', () => {
    maxByArkhe(largeArray, person => person.age);
  });
});
