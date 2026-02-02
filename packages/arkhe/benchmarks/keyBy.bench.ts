// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { keyBy as keyByToolkit_ } from 'es-toolkit';
import { keyBy as keyByCompatToolkit_ } from 'es-toolkit/compat';
import { keyBy as keyByLodashEs_ } from 'lodash-es';
import { keyBy as keyByArkhe_ } from '../../pithos/src/arkhe/array/key-by';

const keyByToolkit = keyByToolkit_;
const keyByCompatToolkit = keyByCompatToolkit_;
const keyByLodashEs = keyByLodashEs_;
const keyByArkhe = keyByArkhe_;

describe('keyBy', () => {
  bench('es-toolkit/keyBy', () => {
    const people = [
          { name: 'mike', age: 20 },
          { name: 'jake', age: 30 },
          { name: 'john', age: 25 },
          { name: 'sarah', age: 25 },
          { name: 'emma', age: 25 },
        ];
    
        keyByToolkit(people, person => person.name);
  });

  bench('es-toolkit/compat/keyBy', () => {
    const people = [
          { name: 'mike', age: 20 },
          { name: 'jake', age: 30 },
          { name: 'john', age: 25 },
          { name: 'sarah', age: 25 },
          { name: 'emma', age: 25 },
        ];
    
        keyByCompatToolkit(people, person => person.name);
  });

  bench('lodash-es/keyBy', () => {
    const people = [
          { name: 'mike', age: 20 },
          { name: 'jake', age: 30 },
          { name: 'john', age: 25 },
          { name: 'sarah', age: 25 },
          { name: 'emma', age: 25 },
        ];
    
        keyByLodashEs(people, person => person.name);
  });

  bench('arkhe/keyBy', () => {
    const people = [
          { name: 'mike', age: 20 },
          { name: 'jake', age: 30 },
          { name: 'john', age: 25 },
          { name: 'sarah', age: 25 },
          { name: 'emma', age: 25 },
        ];
    
        keyByArkhe(people, person => person.name);
  });
});

describe('keyBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({ name: `name${i}`, age: i }));

  bench('es-toolkit/keyBy', () => {
    keyByToolkit(largeArray, person => person.name);
  });

  bench('es-toolkit/compat/keyBy', () => {
    keyByCompatToolkit(largeArray, person => person.name);
  });

  bench('lodash-es/keyBy', () => {
    keyByLodashEs(largeArray, person => person.name);
  });

  bench('arkhe/keyBy', () => {
    keyByArkhe(largeArray, person => person.name);
  });
});
