import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "<rootDir>/jest.environment.cjs",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: [
    "<rootDir>/../tests/unit",
    "<rootDir>/../tests/integration",
    "<rootDir>/tests/unit",
    "<rootDir>/tests/integration",
    "<rootDir>/tests/type-verification",
    "<rootDir>/tests/verification",
  ],
  modulePaths: ["<rootDir>/node_modules"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react/jsx-runtime$": "<rootDir>/node_modules/react/jsx-runtime",
    "^react/jsx-dev-runtime$": "<rootDir>/node_modules/react/jsx-dev-runtime",
    "^file://([^?]+)\\?.*$": "$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.tsx",
    "!src/**/types.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(customJestConfig);
