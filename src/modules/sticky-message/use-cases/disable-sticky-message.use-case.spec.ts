import { Test, TestingModule } from "@nestjs/testing"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { ChatInputCommandInteraction } from "discord.js"
import { DisableStickyMessageUseCase } from "./disable-sticky-message.use-case"
import { StickyMessageRepository } from "../repositories/sticky-message.repository"
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
          provide: StickyMessageRepository,
          useValue: mockDeep<StickyMessageRepository>(),
        },
        {
          provide: LOGGER,
          useValue: mockDeep<Logger>(),
        },
      ],
    }).compile()

    useCase = module.get<DisableStickyMessageUseCase>(DisableStickyMessageUseCase)
    stickyMessageRepository = module.get(StickyMessageRepository)
    logger = module.get(LOGGER)
    interaction = mockDeep<ChatInputCommandInteraction>()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    it("should disable sticky message using channel from options", async () => {
      const mockChannel = { id: "channel-from-options" }
      const options: DisableStickyMessageDto = { channel: mockChannel as any }
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith("channel-from-options")
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#channel-from-options>.`,
        flags: "Ephemeral",
      })
    })

    it("should disable sticky message using channel from interaction when options.channel is not provided", async () => {
      const options: DisableStickyMessageDto = {}
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith(interaction.channelId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#${interaction.channelId}>.`,
        flags: "Ephemeral",
      })
    })

    it("should use interaction channelId when channel option has no id property", async () => {
      const mockChannel = {}
      const options: DisableStickyMessageDto = { channel: mockChannel as any }
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith(interaction.channelId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#${interaction.channelId}>.`,
        flags: "Ephemeral",
      })
    })

    it("should use interaction channelId when channel option is null", async () => {
      const options: DisableStickyMessageDto = { channel: null as any }
      interaction.channelId = "channel-from-interaction"

      await useCase.execute(interaction, options)

      expect(stickyMessageRepository.deleteByChannelId).toHaveBeenCalledWith(interaction.channelId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Sticky message has been disabled for <#${interaction.channelId}>.`,
        flags: "Ephemeral",
      })
    })

    it("should handle errors during deletion", async () => {
      const mockChannel = { id: "some-channel" }
      const options: DisableStickyMessageDto = { channel: mockChannel as any }
      const error = new Error("Deletion failed")
      stickyMessageRepository.deleteByChannelId.mockRejectedValue(error)

      await useCase.execute(interaction, options)

      expect(logger.error).toHaveBeenCalledWith(`Failed to disable sticky message for channel some-channel`, error)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Failed to disable sticky message for <#some-channel>. Please try again later.`,
        flags: "Ephemeral",
      })
    })

    it("should handle errors during deletion with interaction channelId fallback", async () => {
      const options: DisableStickyMessageDto = {}
      interaction.channelId = "interaction-channel"
      const error = new Error("Deletion failed")
      stickyMessageRepository.deleteByChannelId.mockRejectedValue(error)

      await useCase.execute(interaction, options)

      expect(logger.error).toHaveBeenCalledWith(
        `Failed to disable sticky message for channel interaction-channel`,
        error,
      )
      expect(interaction.reply).toHaveBeenCalledWith({
        content: `Failed to disable sticky message for <#interaction-channel>. Please try again later.`,
        flags: "Ephemeral",
      })
    })
  })
})
