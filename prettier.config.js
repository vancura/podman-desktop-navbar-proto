/** @type {import('prettier').Config} */
export default {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    trailingComma: 'all',
    printWidth: 120,
    endOfLine: 'lf',
    plugins: ['prettier-plugin-svelte'],

    overrides: [
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
                tabWidth: 4,
                printWidth: 120,
            },
        },
        {
            files: ['*.md', '*.mdx'],
            options: {
                parser: 'markdown',
                proseWrap: 'always',
                tabWidth: 2,
            },
        },
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
