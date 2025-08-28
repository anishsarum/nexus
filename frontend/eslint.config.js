import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      'build/**',
      'public/**',
      'node_modules/**',
      '*.js',
      '*.jsx',
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        HTMLElement: 'readonly',
        HTMLFormElement: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        navigator: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        ResizeObserver: 'readonly',
        DOMException: 'readonly',
        Element: 'readonly',
        ShadowRoot: 'readonly',
        DocumentFragment: 'readonly',
        AbortController: 'readonly',
        WorkerGlobalScope: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        ReadableStream: 'readonly',
        URLSearchParams: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        global: 'readonly',
        self: 'readonly',
        queueMicrotask: 'readonly',
        setImmediate: 'readonly',
        clearInterval: 'readonly',
        setInterval: 'readonly',
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