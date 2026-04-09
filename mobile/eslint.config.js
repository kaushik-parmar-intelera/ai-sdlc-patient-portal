const js = require("@eslint/js");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "coverage/**",
      "package-lock.json",
      "babel.config.js",
      "jest.config.js",
      "metro.config.js",
    ],
  },
  js.configs.recommended,
];
