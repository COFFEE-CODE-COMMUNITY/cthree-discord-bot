import { Test, TestingModule } from "@nestjs/testing"
import { Client } from "discord.js"
import { StatServerService } from "./stat-server.service"
import { UpdateStatServerUseCases } from "../use-cases/update-stat-server.use-cases"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"

jest.mock("../constants/stat-server.constants", () => ({
  STAT_DEFINITIONS: [
    { label: "Fail Role", roleKey: "FAIL_ROLE", channelKey: "FAIL_CHANNEL" },
    { label: "Success Role", roleKey: "SUCCESS_ROLE", channelKey: "SUCCESS_CHANNEL" },
  ],
}))

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  setContext: jest.fn(),
}

const mockSecretManager = {
  getOrThrow: jest.fn(),
}

const mockUpdateStatServerUseCases = {
  execute: jest.fn(),
}

const mockGuild = {
  name: "Mock Guild",
  members: { fetch: jest.fn() },
}

const mockClient = {
  guilds: { fetch: jest.fn().mockResolvedValue(mockGuild) },
}

describe("StatServerService", () => {
  let service: StatServerService

  beforeEach(async () => {
    jest.useFakeTimers()
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatServerService,
        { provide: Client, useValue: mockClient },
        { provide: LOGGER, useValue: mockLogger },
        { provide: SecretManager, useValue: mockSecretManager },
        { provide: UpdateStatServerUseCases, useValue: mockUpdateStatServerUseCases },
      ],
    }).compile()

    service = module.get<StatServerService>(StatServerService)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("initialize", () => {
    it("should continue loading other mappings if one fails", async () => {
      mockSecretManager.getOrThrow.mockImplementation(async (key: string) => {
        if (key.startsWith("FAIL")) throw new Error("Secret not found")
        if (key === "C3_GUILD_ID") return "mock-guild-id"
        return `mock-id-for-${key}`
      })

      await service.initialize()

      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Could not load mapping for "Fail Role"'))

      expect(mockLogger.log).toHaveBeenCalledWith("Loaded 1 stat mappings.")

      expect(mockClient.guilds.fetch).toHaveBeenCalledWith("mock-guild-id")
      expect(mockUpdateStatServerUseCases.execute).toHaveBeenCalledTimes(1)
    })

    it("should initialize correctly and set an interval", async () => {
      mockSecretManager.getOrThrow.mockResolvedValue("mock-id")

      await service.initialize()

      expect(mockUpdateStatServerUseCases.execute).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(6 * 60 * 60 * 1000)

      expect(mockUpdateStatServerUseCases.execute).toHaveBeenCalledTimes(2)
    })
  })
})
