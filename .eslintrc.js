module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    /* React
    emcaFeatures: {
      jsx: true
    }
    */
  },
  /* React
  settings: {
    react: {
      version: "detect"
    }
  },
  */
  plugins: [
    "@typescript-eslint",
    "typescript-sort-keys",
    "import",
    /* React
    "react-hooks",
    "react",
    */
  ],
  rules: {
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
    "import/order": [
      "warn",
      {
        "alphabetize": { "order": "asc" },
        "newlines-between": "always",
      }
    ]
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    /* React
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    */
    "prettier",
  ],
  root: true,
  ignorePatterns: [".eslintrc.js", "dist/*.js", "*.config.js"],
}
