// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { toPath as toPathCompatToolkit_ } from 'es-toolkit/compat';
import { toPath as toPathLodashEs_ } from 'lodash-es';
import { toPath as toPathTaphos_ } from '../../pithos/src/taphos/util/toPath';

const toPathCompatToolkit = toPathCompatToolkit_;
const toPathLodashEs = toPathLodashEs_;
const toPathTaphos = toPathTaphos_;

describe('toPath/simple', () => {
  bench('es-toolkit/compat/toPath', () => {
    toPathCompatToolkit('a');
  });

  bench('lodash-es/toPath', () => {
    toPathLodashEs('a');
  });

  bench('taphos/toPath', () => {
    toPathTaphos('a');
  });

  bench('native/toPath', () => {
    'a'.split('.');
  });
});

describe('toPath/dots', () => {
  bench('es-toolkit/compat/toPath', () => {
    toPathCompatToolkit('a.b.c');
  });

  bench('lodash-es/toPath', () => {
    toPathLodashEs('a.b.c');
  });

  bench('taphos/toPath', () => {
    toPathTaphos('a.b.c');
  });

  bench('native/toPath', () => {
    'a.b.c'.split('.');
  });
});

describe('toPath/brackets', () => {
  bench('es-toolkit/compat/toPath', () => {
    toPathCompatToolkit('a[b][c]');
  });

  bench('lodash-es/toPath', () => {
    toPathLodashEs('a[b][c]');
  });

  bench('taphos/toPath', () => {
    toPathTaphos('a[b][c]');
  });
});

describe('toPath/complex', () => {
  bench('es-toolkit/compat/toPath', () => {
    toPathCompatToolkit('a[b].c[0].d["e"]');
  });

  bench('lodash-es/toPath', () => {
    toPathLodashEs('a[b].c[0].d["e"]');
  });

  bench('taphos/toPath', () => {
    toPathTaphos('a[b].c[0].d["e"]');
  });
});
