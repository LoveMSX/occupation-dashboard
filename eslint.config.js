import js from "@eslint/js";
import react from "eslint-plugin-react";
import markdown from "eslint-plugin-markdown";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const tsEslintRecommended = tseslint.configs.recommended.rules;
const reactRecommended = react.configs.recommended.rules;

export default [
  ...markdown.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "markdown": markdown,
      react: react,
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tsEslintRecommended,
      ...reactRecommended,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // Markdown rules are handled by the recommended config
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
