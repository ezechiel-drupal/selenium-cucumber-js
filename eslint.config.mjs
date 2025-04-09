// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      "dist",
      "node_modules",
      "eslint.config.mjs",
      "cucumber.js",
      "src/step-definitions/setup/hooks.ts",
    ],
  },

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ["src/*.ts", "src/**/*.ts", "src/**/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
