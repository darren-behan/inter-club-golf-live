module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
      "sourceType": "module"
  },
  "rules": {
      "indent": ["error", 4],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-console": "off"
  }
  // "extends": [
  //   "airbnb",
  //   "plugin:prettier/recommended",
  //   "prettier"
  // ],
  // "env": {
  //   "browser": true,
  //   "commonjs": true,
  //   "es6": true,
  //   "jest": true,
  //   "node": true
  // },
  // "rules": {
  //   "jsx-a11y/href-no-hash": ["off"],
  //   "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }],
  //   "max-len": [
  //     "warn",
  //     {
  //       "code": 120,
  //       "tabWidth": 2,
  //       "comments": 120,
  //       "ignoreComments": false,
  //       "ignoreTrailingComments": true,
  //       "ignoreUrls": true,
  //       "ignoreStrings": true,
  //       "ignoreTemplateLiterals": true,
  //       "ignoreRegExpLiterals": true
  //     }
  //   ]
  // }
}
