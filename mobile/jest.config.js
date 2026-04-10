module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>", "<rootDir>/../tests"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/unit/mobile/**/*.test.ts",
    "**/unit/mobile/**/*.test.tsx",
    "**/integration/mobile/**/*.test.ts",
    "**/integration/mobile/**/*.test.tsx",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo(nent)?|expo-modules-core|@expo|expo-router|@expo/vector-icons)/)",
  ],
};
