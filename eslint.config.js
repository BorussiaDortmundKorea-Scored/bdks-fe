// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import query from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config([
  {
    ignores: ["dist/**", "build/**", ".next/**", "node_modules/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...query.configs["flat/recommended"],
      eslintConfigPrettier,
    ],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@tanstack/query": query,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // React Query 관련 규칙
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-rest-destructuring": "warn",
      "@tanstack/query/stable-query-client": "error",
      "@tanstack/query/no-unstable-deps": "warn",
      "@tanstack/query/prefer-query-object-syntax": "warn",
    },
  },
], storybook.configs["flat/recommended"]);
