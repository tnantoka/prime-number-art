module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: true }]
  }
};
