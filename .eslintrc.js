module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn",
  },
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js"],
};
