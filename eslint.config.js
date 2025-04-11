import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import("eslint").Linter.Config[]} */
export default [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
            globals: {
                Bun: 'readonly',
                __dirname: 'readonly',
                console: 'readonly',
                process: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            import: importPlugin,
            'unused-imports': unusedImports,
            prettier: prettierPlugin,
        },
        rules: {
            'unused-imports/no-unused-imports': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'error', // disallow console.log by default
            'prettier/prettier': 'error', // 💥 enforce Prettier via ESLint
        },
    },
    prettier,
    {
        files: ['src/index.ts'],
        rules: {
            'no-console': 'off', // ✅ allow console in CLI
        },
    },
];
