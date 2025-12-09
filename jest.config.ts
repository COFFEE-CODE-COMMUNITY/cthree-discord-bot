import type { JestConfigWithTsJest } from "ts-jest"

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  rootDir: "src",
}

export default config
