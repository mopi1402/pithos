// Based on es-toolkit benchmark, adapted to include lodash-es and taphos
import { bench, describe } from 'vitest';
import { isElement as isElementCompatToolkit_ } from 'es-toolkit/compat';
import { isElement as isElementLodashEs_ } from 'lodash-es';
import { isElement as isElementTaphos_ } from '../../pithos/src/taphos/lang/isElement';

const isElementCompatToolkit = isElementCompatToolkit_;
const isElementLodashEs = isElementLodashEs_;
const isElementTaphos = isElementTaphos_;

class ElementLike {
  nodeType = 1;
}

const NotElementLike = { nodeType: 1 };

describe('isElement/true', () => {
  bench('es-toolkit/compat/isElement', () => {
    isElementCompatToolkit(ElementLike);
  });

  bench('lodash-es/isElement', () => {
    isElementLodashEs(ElementLike);
  });

  bench('taphos/isElement', () => {
    isElementTaphos(ElementLike);
  });

  bench('native/isElement', () => {
    // Native approach: instanceof Element (only works in browser)
    typeof Element !== 'undefined' && ElementLike instanceof Element;
  });
});

describe('isElement/false', () => {
  bench('es-toolkit/compat/isElement', () => {
    isElementCompatToolkit(NotElementLike);
  });

  bench('lodash-es/isElement', () => {
    isElementLodashEs(NotElementLike);
  });

  bench('taphos/isElement', () => {
    isElementTaphos(NotElementLike);
  });

  bench('native/isElement', () => {
    // Native approach: instanceof Element (only works in browser)
    typeof Element !== 'undefined' && NotElementLike instanceof Element;
  });
});
