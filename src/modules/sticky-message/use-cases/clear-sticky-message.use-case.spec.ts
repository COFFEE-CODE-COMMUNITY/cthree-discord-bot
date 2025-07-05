import { Test, TestingModule } from "@nestjs/testing"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { ChatInputCommandInteraction } from "discord.js"
import { ClearStickyMessageUseCase } from "./clear-sticky-message.use-case"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

describe("ClearStickyMessageUseCase", () => {
  let useCase: ClearStickyMessageUseCase
  let stickyMessageRepository: DeepMockProxy<StickyMessageRepository>
  let logger: DeepMockProxy<Logger>
  let interaction: DeepMockProxy<ChatInputCommandInteraction>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClearStickyMessageUseCase,
        {
          provide: STICKY_MESSAGE_REPOSITORY,
          useValue: mockDeep<StickyMessageRepository>(),
        },
        {
          provide: LOGGER,
          useValue: mockDeep<Logger>(),
        },
      ],
    }).compile()

    useCase = module.get<ClearStickyMessageUseCase>(ClearStickyMessageUseCase)
    stickyMessageRepository = module.get(STICKY_MESSAGE_REPOSITORY)
    logger = module.get(LOGGER)
    interaction = mockDeep<ChatInputCommandInteraction>()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    const guildId = "test-guild-id"

    it("should clear sticky messages and reply with success if guildId exists", async () => {
      interaction.guildId = guildId

      await useCase.execute(interaction)

      expect(stickyMessageRepository.deleteByGuildId).toHaveBeenCalledWith(guildId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "All sticky messages have been cleared on this server.",
        flags: "Ephemeral",
      })
    })

    it("should log error and reply with error message if deletion fails", async () => {
      interaction.guildId = guildId
      const error = new Error("Deletion failed")
      stickyMessageRepository.deleteByGuildId.mockRejectedValue(error)

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith("Failed to clear sticky messages", error)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "An error occurred while trying to clear the sticky messages. Please try again later.",
        flags: "Ephemeral",
      })
    })

    it("should log error and reply with error message if guildId is not available", async () => {
      interaction.guildId = null

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith("Guild ID is not available in the interaction.")
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "You must be in a server to clear the sticky message.",
        flags: "Ephemeral",
      })
    })
  })
})
