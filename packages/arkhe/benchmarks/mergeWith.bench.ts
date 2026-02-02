// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { mergeWith as mergeWithToolkit_ } from 'es-toolkit';
import { mergeWith as mergeWithCompatToolkit_ } from 'es-toolkit/compat';
import { mergeWith as mergeWithLodashEs_ } from 'lodash-es';
import { mergeWith as mergeWithArkhe_ } from '../../pithos/src/arkhe/object/merge-with';

const mergeWithToolkit = mergeWithToolkit_;
const mergeWithCompatToolkit = mergeWithCompatToolkit_;
const mergeWithLodashEs = mergeWithLodashEs_;
const mergeWithArkhe = mergeWithArkhe_;

const object = { a: [1], b: [2] };
const other = { a: [3], b: [4] };
const merge = (objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return objValue.concat(srcValue);
  }
  return undefined;
};

describe('mergeWith', () => {
  bench('es-toolkit/mergeWith', () => {
    mergeWithToolkit({ ...object }, other, merge);
  });

  bench('es-toolkit/compat/mergeWith', () => {
    mergeWithCompatToolkit({ ...object }, other, merge);
  });

  bench('lodash-es/mergeWith', () => {
    mergeWithLodashEs({ ...object }, other, merge);
  });

  bench('arkhe/mergeWith', () => {
    mergeWithArkhe({ ...object }, other, merge);
  });
});
