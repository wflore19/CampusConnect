/** @type {import("eslint").Linter.Config} */
export default [{
    extends: ['@oyster/eslint-config/base'],
    parserOptions: {
      tsconfigRootDir: __dirname,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
    },
}];
