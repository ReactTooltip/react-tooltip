/* eslint-disable max-len */

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx,css}', '!src/*', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['./src/test/jest-setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        useESM: true,
      },
    ],
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
    '^.+\\.js?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        useESM: true,
        isolatedModules: true,
      },
    ],
    '^.+\\.css$': 'jest-transform-css',
  },
}
