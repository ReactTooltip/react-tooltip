import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  CustomEvent: 'readonly',
  MutationObserver: 'readonly',
  ResizeObserver: 'readonly',
  HTMLElement: 'readonly',
  Element: 'readonly',
  Node: 'readonly',
  Event: 'readonly',
  MouseEvent: 'readonly',
  FocusEvent: 'readonly',
  KeyboardEvent: 'readonly',
  getComputedStyle: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
}

const jestGlobals = {
  describe: 'readonly',
  test: 'readonly',
  it: 'readonly',
  expect: 'readonly',
  jest: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
}

export default [
  {
    ignores: ['dist/**', 'build/**', 'docs/build/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...browserGlobals,
        ...jestGlobals,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
    },
    rules: {
      'operator-linebreak': [
        2,
        'after',
        {
          overrides: {
            '?': 'before',
            ':': 'before',
          },
        },
      ],
      'object-curly-newline': 0,
      'implicit-arrow-linebreak': 0,
      semi: ['error', 'never'],
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          amd: true,
        },
      ],
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'react/button-has-type': 0,
      'jsx-a11y/href-no-hash': 'off',
      'jsx-a11y/label-has-for': [
        'error',
        {
          allowChildren: true,
        },
      ],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          specialLink: ['to'],
        },
      ],
      'react/jsx-props-no-spreading': 0,
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
      'import/extensions': 0,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'dot-notation': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
