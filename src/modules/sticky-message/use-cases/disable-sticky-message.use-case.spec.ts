import { Test, TestingModule } from "@nestjs/testing"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { ChatInputCommandInteraction } from "discord.js"
import { DisableStickyMessageUseCase } from "./disable-sticky-message.use-case"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { DisableStickyMessageDto } from "../dtos/disable-sticky-message.dto"

describe("DisableStickyMessageUseCase", () => {
  let useCase: DisableStickyMessageUseCase
  let stickyMessageRepository: DeepMockProxy<StickyMessageRepository>
  let logger: DeepMockProxy<Logger>
  let interaction: DeepMockProxy<ChatInputCommandInteraction>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisableStickyMessageUseCase,
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

    useCase = module.get<DisableStickyMessageUseCase>(DisableStickyMessageUseCase)
    stickyMessageRepository = module.get(STICKY_MESSAGE_REPOSITORY)
    logger = module.get(LOGGER)
    interaction = mockDeep<ChatInputCommandInteraction>()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    it("should disable sticky message using channel from options", async () => {
      const options: DisableStickyMessageDto = { channel: "channel-from-options" }
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith(options.channel)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#${options.channel}>.`,
        flags: "Ephemeral",
      })
    })

    it("should disable sticky message using channel from interaction when options.channel is not provided", async () => {
      const options: DisableStickyMessageDto = { channel: undefined }
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith(interaction.channelId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#${interaction.channelId}>.`,
        flags: "Ephemeral",
      })
    })

    it("should handle errors during deletion", async () => {
      const options: DisableStickyMessageDto = { channel: "some-channel" }
      const error = new Error("Deletion failed")
      stickyMessageRepository.deleteByChannelId.mockRejectedValue(error)

      await useCase.execute(interaction, options)

      expect(logger.error).toHaveBeenCalledWith(
        `Failed to disable sticky message for channel ${options.channel}`,
        error,
      )
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Failed to disable sticky message for <#${options.channel}>. Please try again later.`,
        flags: "Ephemeral",
      })
    })
  })
})
