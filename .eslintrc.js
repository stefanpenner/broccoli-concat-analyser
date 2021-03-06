module.exports = {
  "extends": "eslint:recommended",
  "plugins": ["jest"],
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "ignorePatterns": [
    "test/fixtures/input"
  ],
  "rules": {
  }
};
