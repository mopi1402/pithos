// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { omit as omitToolkit_ } from 'es-toolkit';
import { omit as omitCompatToolkit_ } from 'es-toolkit/compat';
import { omit as omitLodashEs_ } from 'lodash-es';
import { omit as omitArkhe_ } from '../../pithos/src/arkhe/object/omit';

const omitToolkit = omitToolkit_;
const omitCompatToolkit = omitCompatToolkit_;
const omitLodashEs = omitLodashEs_;
const omitArkhe = omitArkhe_;

describe('omit', () => {
  bench('es-toolkit/omit', () => {
    omitToolkit({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('es-toolkit/compat/omit', () => {
    omitCompatToolkit({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('lodash-es/omit', () => {
    omitLodashEs({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });

  bench('arkhe/omit', () => {
    omitArkhe({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar']);
  });
});

describe('omit/complex', () => {
  bench('es-toolkit/omit', () => {
    omitToolkit({ foo: { bar: { baz: 1 } }, quux: 2, a: { b: 3 } }, ['foo.bar.baz', 'quux']);
  });

  bench('es-toolkit/compat/omit', () => {
    omitCompatToolkit({ foo: { bar: { baz: 1 } }, quux: 2, a: { b: 3 } }, ['foo.bar.baz', 'quux']);
  });

  bench('lodash-es/omit', () => {
    omitLodashEs({ foo: { bar: { baz: 1 } }, quux: 2, a: { b: 3 } }, ['foo.bar.baz', 'quux']);
  });

  bench('arkhe/omit', () => {
    omitArkhe({ foo: { bar: { baz: 1 } }, quux: 2, a: { b: 3 } }, ['foo.bar.baz', 'quux']);
  });
});
