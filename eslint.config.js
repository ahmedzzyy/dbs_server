import globals from "globals";
import pluginJs from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
export default [
  globalIgnores(["public/**/*"]),
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  },
  eslintConfigPrettier,
];