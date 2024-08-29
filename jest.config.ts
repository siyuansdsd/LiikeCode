module.exports = {
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec).ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/data/service/*.*.{ts,tsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text"],
};
