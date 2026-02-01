module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y", "import"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "jsx-a11y/anchor-is-valid": "off"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
