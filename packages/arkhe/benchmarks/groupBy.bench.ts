// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { groupBy as groupByToolkit_ } from 'es-toolkit';
import { groupBy as groupByCompatToolkit_ } from 'es-toolkit/compat';
import { groupBy as groupByLodashEs_ } from 'lodash-es';
import { groupBy as groupByArkhe_ } from '../../pithos/src/arkhe/array/group-by';

const groupByToolkit = groupByToolkit_;
const groupByCompatToolkit = groupByCompatToolkit_;
const groupByLodashEs = groupByLodashEs_;
const groupByArkhe = groupByArkhe_;

describe('groupBy', () => {
  bench('es-toolkit/groupBy', () => {
    const array = [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' },
          { category: 'vegetable', name: 'carrot' },
          { category: 'fruit', name: 'pear' },
          { category: 'vegetable', name: 'broccoli' },
        ];
    
        groupByToolkit(array, item => item.category);
  });

  bench('es-toolkit/compat/groupBy', () => {
    const array = [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' },
          { category: 'vegetable', name: 'carrot' },
          { category: 'fruit', name: 'pear' },
          { category: 'vegetable', name: 'broccoli' },
        ];
    
        groupByCompatToolkit(array, item => item.category);
  });

  bench('lodash-es/groupBy', () => {
    const array = [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' },
          { category: 'vegetable', name: 'carrot' },
          { category: 'fruit', name: 'pear' },
          { category: 'vegetable', name: 'broccoli' },
        ];
    
        groupByLodashEs(array, item => item.category);
  });

  bench('arkhe/groupBy', () => {
    const array = [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' },
          { category: 'vegetable', name: 'carrot' },
          { category: 'fruit', name: 'pear' },
          { category: 'vegetable', name: 'broccoli' },
        ];
    
        groupByArkhe(array, item => item.category);
  });
});

describe('groupBy/largeArray', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({
    category: i % 2 === 0 ? 'even' : 'odd',
    value: i,
  }));

  bench('es-toolkit/groupBy', () => {
    groupByToolkit(largeArray, item => item.category);
  });

  bench('es-toolkit/compat/groupBy', () => {
    groupByCompatToolkit(largeArray, item => item.category);
  });

  bench('lodash-es/groupBy', () => {
    groupByLodashEs(largeArray, item => item.category);
  });

  bench('arkhe/groupBy', () => {
    groupByArkhe(largeArray, item => item.category);
  });
});
