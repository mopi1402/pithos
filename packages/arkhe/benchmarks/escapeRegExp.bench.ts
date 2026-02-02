// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
import { bench, describe } from 'vitest';
import { escapeRegExp as escapeRegExpToolkit_ } from 'es-toolkit';
import { escapeRegExp as escapeRegExpCompatToolkit_ } from 'es-toolkit/compat';
import { escapeRegExp as escapeRegExpLodashEs_ } from 'lodash-es';
import { escapeRegExp as escapeRegExpArkhe_ } from '../../pithos/src/arkhe/string/escape-regexp';

const escapeRegExpToolkit = escapeRegExpToolkit_;
const escapeRegExpCompatToolkit = escapeRegExpCompatToolkit_;
const escapeRegExpLodashEs = escapeRegExpLodashEs_;
const escapeRegExpArkhe = escapeRegExpArkhe_;

describe('escapeRegExp', () => {
  bench('es-toolkit/escapeRegExp', () => {
    escapeRegExpToolkit('^$.*+?()[]{}|\\');
  });

  bench('es-toolkit/compat/escapeRegExp', () => {
    escapeRegExpCompatToolkit('^$.*+?()[]{}|\\');
  });

  bench('lodash-es/escapeRegExp', () => {
    escapeRegExpLodashEs('^$.*+?()[]{}|\\');
  });

  bench('arkhe/escapeRegExp', () => {
    escapeRegExpArkhe('^$.*+?()[]{}|\\');
  });
});
