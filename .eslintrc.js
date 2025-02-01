/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'next',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'react', 'react-hooks', '@typescript-eslint'],
  // Ignore Files in v9 (Deprecated)
  // https://eslint.org/docs/latest/use/configure/ignore-deprecated
  ignorePatterns: ['/build/', '/dist/', '/out/', '/components/ui/'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // ... is defined but never used.
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    // ... is never reassigned. Use 'const' instead.
    'prefer-const': 'warn',
    // Using `<img>` could result in slower LCP and higher bandwidth.
    '@next/next/no-img-element': 'off',
    // Unexpected any. Specify a different type.
    '@typescript-eslint/no-explicit-any': 'off',
    // An empty interface declaration allows any non-nullish value
    '@typescript-eslint/no-empty-object-type': 'off',
  },
}
