// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { uniqueId as uniqueIdCompatToolkit_ } from 'es-toolkit/compat';
import { uniqueId as uniqueIdLodashEs_ } from 'lodash-es';
import { uniqueId as uniqueIdArkhe_ } from '../../pithos/src/arkhe/util/unique-id';

const uniqueIdCompatToolkit = uniqueIdCompatToolkit_;
const uniqueIdLodashEs = uniqueIdLodashEs_;
const uniqueIdArkhe = uniqueIdArkhe_;

describe('uniqueId', () => {
  bench('es-toolkit/compat/uniqueId', () => {
    uniqueIdCompatToolkit();
        uniqueIdCompatToolkit();
        uniqueIdCompatToolkit();
        uniqueIdCompatToolkit();
        uniqueIdCompatToolkit();
        uniqueIdCompatToolkit('prefix_');
        uniqueIdCompatToolkit('prefix_');
        uniqueIdCompatToolkit('prefix_');
        uniqueIdCompatToolkit('prefix_');
        uniqueIdCompatToolkit('prefix_');
  });

  bench('lodash-es/uniqueId', () => {
    uniqueIdLodashEs();
        uniqueIdLodashEs();
        uniqueIdLodashEs();
        uniqueIdLodashEs();
        uniqueIdLodashEs();
        uniqueIdLodashEs('prefix_');
        uniqueIdLodashEs('prefix_');
        uniqueIdLodashEs('prefix_');
        uniqueIdLodashEs('prefix_');
        uniqueIdLodashEs('prefix_');
  });

  bench('arkhe/uniqueId', () => {
    uniqueIdArkhe();
        uniqueIdArkhe();
        uniqueIdArkhe();
        uniqueIdArkhe();
        uniqueIdArkhe();
        uniqueIdArkhe('prefix_');
        uniqueIdArkhe('prefix_');
        uniqueIdArkhe('prefix_');
        uniqueIdArkhe('prefix_');
        uniqueIdArkhe('prefix_');
  });
});
