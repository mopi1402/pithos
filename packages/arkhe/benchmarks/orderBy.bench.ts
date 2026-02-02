// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { orderBy as orderByToolkit_ } from 'es-toolkit';
import { orderBy as orderByCompatToolkit_ } from 'es-toolkit/compat';
import { orderBy as orderByLodashEs_ } from 'lodash-es';
import { orderBy as orderByArkhe_ } from '../../pithos/src/arkhe/array/order-by';

const orderByToolkit = orderByToolkit_;
const orderByCompatToolkit = orderByCompatToolkit_;
const orderByLodashEs = orderByLodashEs_;
const orderByArkhe = orderByArkhe_;

const users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

describe('orderBy', () => {
  bench('es-toolkit/orderBy', () => {
    orderByToolkit(users, ['user', 'age'], ['asc', 'desc']);
  });

  bench('es-toolkit/compat/orderBy', () => {
    orderByCompatToolkit(users, ['user', 'age'], ['asc', 'desc']);
  });

  bench('lodash-es/orderBy', () => {
    orderByLodashEs(users, ['user', 'age'], ['asc', 'desc']);
  });

  bench('arkhe/orderBy', () => {
    orderByArkhe(users, ['user', 'age'], ['asc', 'desc']);
  });
});

describe('orderBy/withFunctions', () => {
  bench('es-toolkit/orderBy', () => {
    orderByToolkit(users, [u => u.user, u => u.age], ['asc', 'desc']);
  });

  bench('es-toolkit/compat/orderBy', () => {
    orderByCompatToolkit(users, [u => u.user, u => u.age], ['asc', 'desc']);
  });

  bench('lodash-es/orderBy', () => {
    orderByLodashEs(users, [u => u.user, u => u.age], ['asc', 'desc']);
  });

  bench('arkhe/orderBy', () => {
    orderByArkhe(users, [u => u.user, u => u.age], ['asc', 'desc']);
  });
});
