module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'html',
  ],
  rules: {
  },
};
