module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.jest.json"
    }
  },
  "transform": {
    ".(ts|tsx)": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ]
};