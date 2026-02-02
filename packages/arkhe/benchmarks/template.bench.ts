// Based on es-toolkit benchmark, adapted to include lodash-es and arkhe
// Note: arkhe template uses {key} syntax, not <%= key %> like lodash
import { bench, describe } from 'vitest';
import { template as templateCompatToolkit_ } from 'es-toolkit/compat';
import { template as templateLodashEs_ } from 'lodash-es';
import { template as templateArkhe_ } from '../../pithos/src/arkhe/string/template';

const templateCompatToolkit = templateCompatToolkit_;
const templateLodashEs = templateLodashEs_;
const templateArkhe = templateArkhe_;

describe('template/interpolate', () => {
  // Note: arkhe template works differently - it interpolates directly without compilation
  // lodash/es-toolkit compile first, then execute. We test the full workflow for each.
  
  bench('es-toolkit/compat/template', () => {
    const compiled = templateCompatToolkit('hello <%= user %>!');
    compiled({ user: 'fred' });
  });

  bench('lodash-es/template', () => {
    const compiled = templateLodashEs('hello <%= user %>!');
    compiled({ user: 'fred' });
  });

  bench('arkhe/template', () => {
    // arkhe uses {key} syntax and interpolates directly
    templateArkhe('hello {user}!', { user: 'fred' });
  });
});

describe('template/nested', () => {
  bench('es-toolkit/compat/template', () => {
    const compiled = templateCompatToolkit('<%= user.name %> <<%= user.email %>>');
    compiled({ user: { name: 'John', email: 'john@example.com' } });
  });

  bench('lodash-es/template', () => {
    const compiled = templateLodashEs('<%= user.name %> <<%= user.email %>>');
    compiled({ user: { name: 'John', email: 'john@example.com' } });
  });

  bench('arkhe/template', () => {
    // arkhe uses {key} syntax with nested paths
    templateArkhe('{user.name} <{user.email}>', { user: { name: 'John', email: 'john@example.com' } });
  });
});
