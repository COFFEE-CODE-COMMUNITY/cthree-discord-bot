import { Test, TestingModule } from "@nestjs/testing"
import { AppEvent } from "./app.event"
import { Logger, LOGGER } from "./common/interfaces/logger/logger.interface"
import { mock, MockProxy } from "jest-mock-extended"
import { Client } from "discord.js"
import { SecretManager } from "./common/abstracts/secret/secret-manager.abstract"
import { CommandsService, ExplorerService, SlashCommandDiscovery, SlashCommandsService } from "necord"

describe("AppEvent", () => {
  let appEvent: AppEvent
  let logger: MockProxy<Logger>
  let secretManager: MockProxy<SecretManager>
  let slashCommandsService: MockProxy<SlashCommandsService>
  let explorerService: MockProxy<ExplorerService<SlashCommandDiscovery>>
  let commandsService: MockProxy<CommandsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppEvent,
        {
          provide: LOGGER,
          useValue: mock<Logger>(),
        },
        {
          provide: SecretManager,
          useValue: mock<SecretManager>(),
        },
        {
          provide: SlashCommandsService,
          useValue: mock<SlashCommandsService>(),
        },
        {
          provide: ExplorerService,
          useValue: mock<ExplorerService<SlashCommandDiscovery>>(),
        },
        {
          provide: CommandsService,
          useValue: mock<CommandsService>(),
        },
      ],
    }).compile()

    appEvent = module.get<AppEvent>(AppEvent)
    logger = module.get(LOGGER)
    secretManager = module.get(SecretManager)
    slashCommandsService = module.get(SlashCommandsService)
    explorerService = module.get(ExplorerService)
    commandsService = module.get(CommandsService)
  })

  it("should be defined", () => {
    expect(appEvent).toBeDefined()
  })

  describe("onReady", () => {
    it("should log client information and a ready message", () => {
      const mockClient = {
        user: {
          tag: "TestClient#0001",
          id: "123456789012345678",
        },
      } as Client<true>

      appEvent.onReady([mockClient])

      expect(logger.info).toHaveBeenCalledWith("Logged in as TestClient#0001 (123456789012345678)")
      expect(logger.info).toHaveBeenCalledWith("Discord bot is ready!")
      expect(logger.info).toHaveBeenCalledTimes(2)
    })
  })

  describe("onDebug", () => {
    it("should log a debug message", () => {
      const message = "debug message"
      appEvent.onDebug([message])
      expect(logger.debug).toHaveBeenCalledWith(message)
      expect(logger.debug).toHaveBeenCalledTimes(1)
    })
  })

  describe("onWarn", () => {
    it("should log a warning message", () => {
      const message = "warning message"
      appEvent.onWarn([message])
      expect(logger.warn).toHaveBeenCalledWith(message)
      expect(logger.warn).toHaveBeenCalledTimes(1)
    })
  })

  describe("onError", () => {
    it("should log an error message and the error object", () => {
      const error = new Error("test error")
      appEvent.onError([error])
      expect(logger.error).toHaveBeenCalledWith(error.message, error)
      expect(logger.error).toHaveBeenCalledTimes(1)
    })
  })

  describe("registerCommands", () => {
    it("should register slash commands for the guild", async () => {
      const mockCommand1 = mock<SlashCommandDiscovery>({
        getName: () => "command1",
      })
      const mockCommand2 = mock<SlashCommandDiscovery>({
        getName: () => "command2",
      })
      const mockSlashCommands = [mockCommand1, mockCommand2]
      const guildId = "test-guild-id"

      explorerService.explore.mockReturnValue(mockSlashCommands)
      secretManager.getOrThrow.mockResolvedValue(guildId)

      await appEvent.registerCommands()

      expect(logger.verbose).toHaveBeenCalledWith("Updating metadata for SlashCommands...")
      expect(secretManager.getOrThrow).toHaveBeenCalledWith("C3_GUILD_ID")

      expect(slashCommandsService.remove).toHaveBeenCalledWith("command1")
      expect(logger.verbose).toHaveBeenCalledWith("Updating metadata for SlashCommand: command1")
      expect(mockCommand1.setGuilds).toHaveBeenCalledWith([guildId])
      expect(slashCommandsService.add).toHaveBeenCalledWith(mockCommand1)

      expect(slashCommandsService.remove).toHaveBeenCalledWith("command2")
      expect(logger.verbose).toHaveBeenCalledWith("Updating metadata for SlashCommand: command2")
      expect(mockCommand2.setGuilds).toHaveBeenCalledWith([guildId])
      expect(slashCommandsService.add).toHaveBeenCalledWith(mockCommand2)
      expect(commandsService.registerInGuild).toHaveBeenCalledWith(guildId)
    })
  })
})
