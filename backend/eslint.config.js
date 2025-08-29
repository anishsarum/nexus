import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'python/**',
      '**/python/**',
      '**/.pixi/**',
      '**/site-packages/**',
      '**/lib/**',
      '**/share/**',
      '**/envs/**',
      '**/build/**',
      '**/dist/**',
      '**/public/**',
      '*.py',
      '*.pyc',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Add custom rules here
    },
  },
];
