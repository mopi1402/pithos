/**
 * Display name mappings for bundle size comparison variants and tests.
 * Extracted from BundleSizeTable/index.tsx for data/presentation separation.
 */

import { translate } from '@docusaurus/Translate';

export const variantNames: Record<string, string> = {
  kanon: translate({ id: 'comparison.bundle.variant.kanon', message: 'Kanon v3' }),
  "zod4-classic": translate({ id: 'comparison.bundle.variant.zod4Classic', message: 'Zod 4 Classic' }),
  "zod4-mini": translate({ id: 'comparison.bundle.variant.zod4Mini', message: 'Zod 4 Mini' }),
  zod3: translate({ id: 'comparison.bundle.variant.zod3', message: 'Zod 3' }),
};

export const testNames: Record<string, string> = {
  "login-form": translate({ id: 'comparison.bundle.test.loginForm', message: 'Login Form' }),
  "user-profile": translate({ id: 'comparison.bundle.test.userProfile', message: 'User Profile' }),
  "api-response": translate({ id: 'comparison.bundle.test.apiResponse', message: 'API Response' }),
  "config-validation": translate({ id: 'comparison.bundle.test.configValidation', message: 'Config Validation' }),
  "form-with-coercion": translate({ id: 'comparison.bundle.test.formWithCoercion', message: 'Form + Coercion' }),
  "full-app": translate({ id: 'comparison.bundle.test.fullApp', message: 'Full App' }),
  string: translate({ id: 'comparison.bundle.test.string', message: 'String' }),
  object: translate({ id: 'comparison.bundle.test.simpleObject', message: 'Simple object' }),
  comprehensive: translate({ id: 'comparison.bundle.test.fullSchema', message: 'Full schema' }),
  "k-namespace": translate({ id: 'comparison.bundle.test.kNamespace', message: 'k namespace' }),
  "z-shim": translate({ id: 'comparison.bundle.test.zShim', message: 'z shim (Zod compat)' }),
  "validation-helper": translate({ id: 'comparison.bundle.test.validationHelper', message: 'validation helper' }),
};
