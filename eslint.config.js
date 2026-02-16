import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    // Base ESLint configuration
    eslint.configs.recommended,

    // Recommended TypeScript configuration
    ...tseslint.configs.recommended,

    // Global configuration
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.browser,
                globalThis: 'readonly',
            },
        },
        rules: {
            'prefer-const': 'error',
            'no-var': 'error',
            'no-console': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            'prefer-arrow-callback': 'error',
            'no-return-assign': 'error',
            'no-sequences': 'error',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'error',
        },
    },

    // Override for pithos-bundle-analyzer
    {
        files: [
            'packages/main/pithos-bundle-analyzer/src/**/*.ts',
            'packages/main/pithos-bundle-analyzer/src/**/*.tsx',
            'packages/main/pithos-bundle-analyzer/vite.config.ts',
        ],
        languageOptions: {
            parserOptions: {
                project: path.resolve(
                    __dirname,
                    'packages/main/pithos-bundle-analyzer/tsconfig.json'
                ),
            },
        },
    },

    // Override for website
    {
        files: [
            'packages/main/website/src/**/*.ts',
            'packages/main/website/src/**/*.tsx',
            'packages/main/website/docusaurus.config.ts',
        ],
        languageOptions: {
            parserOptions: {
                project: path.resolve(
                    __dirname,
                    'packages/main/website/tsconfig.json'
                ),
            },
        },
    },

    // Accessibility rules for website JSX
    {
        files: [
            'packages/main/website/src/**/*.tsx',
        ],
        plugins: {
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...jsxA11y.configs.recommended.rules,
        },
    },

    // Files to ignore
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '**/*.js',
            '**/*.cjs',
            'scripts/**',
            '**/taphos/**',
            '**/kanon/v1/**',
            '**/kanon/v2/**',
            '**/kanon/benchmarks/**',
            'packages/main/documentation/use-cases-data/**',
        ],
    }
);