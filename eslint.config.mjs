import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      semi: "error",
      quotes: ["error", "double"]
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
];