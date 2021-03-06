// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true
  },
  extends: "standard",
  plugins: ["html"],
  rules: {
    "no-mixed-operators": "off",
    "space-before-function-paren": "off",
    quotes: "off",
    semi: "off",
    indent: "off"
  }
};
