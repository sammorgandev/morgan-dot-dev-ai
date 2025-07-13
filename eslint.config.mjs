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
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      
      // React/Next.js specific optimizations
      "react/jsx-no-useless-fragment": "warn",
      "react/no-array-index-key": "warn",
      "react/jsx-key": "error",
      "react/hook-use-state": "off",
      
      // TypeScript optimizations
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "error",
      
      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
      
      // Code quality
      "complexity": ["warn", 10],
      "max-depth": ["warn", 4],
      "max-lines-per-function": ["warn", 50],
      "max-params": ["warn", 4],
    },
  },
];

export default eslintConfig;
