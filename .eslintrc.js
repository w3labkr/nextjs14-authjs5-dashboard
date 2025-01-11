module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
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
    '@typescript-eslint/no-empty-object-type': 'off'
  }
}
