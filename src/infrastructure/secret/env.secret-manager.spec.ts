import { Test, TestingModule } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { mock, MockProxy } from "jest-mock-extended"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { EnvSecretManager } from "./env.secret-manager"
import { NodeEnv } from "../../common/enums/node-env.enum"
import { SecretNotFoundException } from "../../common/exceptions/secret-not-found.exception"

jest.mock("dotenv", () => ({
  config: jest.fn(),
}))
const mockedDotenvConfig = dotenvConfig as jest.Mock

describe("EnvSecretManager", () => {
  let secretManager: EnvSecretManager
  let configService: MockProxy<ConfigService>

  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    mockedDotenvConfig.mockClear()
    configService = mock<ConfigService>()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe("constructor", () => {
    it("should load base .env file and environment-specific .env file", async () => {
      configService.get.mockReturnValue(NodeEnv.TEST)

      const module: TestingModule = await Test.createTestingModule({
        providers: [EnvSecretManager, { provide: ConfigService, useValue: configService }],
      }).compile()
      secretManager = module.get<EnvSecretManager>(EnvSecretManager)

      expect(mockedDotenvConfig).toHaveBeenCalledWith({
        path: resolve(process.cwd(), ".env"),
      })
      expect(mockedDotenvConfig).toHaveBeenCalledWith({
        path: resolve(process.cwd(), `.env.${NodeEnv.TEST}`),
        override: true,
      })
      expect(mockedDotenvConfig).toHaveBeenCalledTimes(2)
    })

    it("should default to development environment if app.nodeEnv is not set", async () => {
      // @ts-ignore
      configService.get.mockImplementation((key, defaultValue) => defaultValue)

      const module: TestingModule = await Test.createTestingModule({
        providers: [EnvSecretManager, { provide: ConfigService, useValue: configService }],
      }).compile()
      secretManager = module.get<EnvSecretManager>(EnvSecretManager)

      expect(configService.get).toHaveBeenCalledWith("app.nodeEnv", NodeEnv.DEVELOPMENT)
      expect(mockedDotenvConfig).toHaveBeenCalledWith({
        path: resolve(process.cwd(), `.env.${NodeEnv.DEVELOPMENT}`),
        override: true,
      })
    })
  })

  describe("get", () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [EnvSecretManager, { provide: ConfigService, useValue: configService }],
      }).compile()
      secretManager = module.get<EnvSecretManager>(EnvSecretManager)
    })

    it("should return the value from process.env if the key exists", async () => {
      const key = "EXISTING_KEY"
      const value = "secret_value"
      process.env[key] = value

      const result = await secretManager.get(key)

      expect(result).toBe(value)
    })

    it("should return null if the key does not exist in process.env", async () => {
      const key = "NON_EXISTING_KEY"
      delete process.env[key]

      const result = await secretManager.get(key)

      expect(result).toBeNull()
    })
  })

  describe("getOrThrow", () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [EnvSecretManager, { provide: ConfigService, useValue: configService }],
      }).compile()
      secretManager = module.get<EnvSecretManager>(EnvSecretManager)
    })

    it("should return the value from process.env if the key exists", async () => {
      const key = "EXISTING_KEY"
      const value = "secret_value"
      process.env[key] = value

      const result = await secretManager.getOrThrow(key)

      expect(result).toBe(value)
    })

    it("should throw SecretNotFoundException if the key does not exist", async () => {
      const key = "NON_EXISTING_KEY"
      delete process.env[key]

      await expect(secretManager.getOrThrow(key)).rejects.toThrow(new SecretNotFoundException(key))
    })
  })
})
