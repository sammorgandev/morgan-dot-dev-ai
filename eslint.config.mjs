import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Performance optimizations
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console statements in development
      "prefer-const": "error",
      "no-var": "error",

      // React/Next.js specific optimizations
      "react/jsx-no-useless-fragment": "warn",
      "react/no-array-index-key": "off", // Often acceptable for static content
      "react/jsx-key": "error",
      "react/hook-use-state": "off",
      "react/no-unescaped-entities": "off", // Handle case by case
      "@next/next/no-img-element": "off", // Allow img for external URLs

      // TypeScript optimizations
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off", // Allow require for configs
      "@typescript-eslint/no-var-requires": "error",

      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",

      // Code quality (disabled for initial cleanup)
      complexity: "off", // Enable when refactoring
      "max-depth": "off", // Enable when refactoring
      "max-lines-per-function": "off", // Enable when refactoring
      "max-params": ["warn", 4],
    },
  },
];

export default eslintConfig;
