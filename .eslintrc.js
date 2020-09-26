module.exports = {
  "extends": "eslint:recommended",
  "plugins": ["jest"],
  "parserOptions": {
    "ecmaVersion": 6
  },
  "ignorePatterns": [
    "test/fixtures/input"
  ],
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "rules": {
  }
};
