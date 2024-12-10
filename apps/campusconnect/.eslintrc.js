/** @type {import("eslint").Linter.Config} */
export default [
    {
        extends: ['@oyster/eslint-config/base'],
        parserOptions: {
            tsconfigRootDir: __dirname,
        },
        rules: {
            'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
            'import/order': [
                WARN,
                {
                    alphabetize: { caseInsensitive: true, order: 'asc' },
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                    ],
                    'newlines-between': 'always',
                },
            ],
        },
    },
];
