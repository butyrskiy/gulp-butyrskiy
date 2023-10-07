module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'airbnb',
    'eslint:recommended',
    'prettier'
  ],
  
  rules: {
    'eqeqeq': ['error', 'always'],
    'max-len': ['error', { code: 135 }],
    'import/prefer-default-export': 'off',
  },
};