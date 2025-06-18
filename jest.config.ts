import { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    "^.+\\.(t|j)s?$": "ts-jest"
  },
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: [
    "**/*.(t|j)s",
  ],
  rootDir: "src"
}

export default config