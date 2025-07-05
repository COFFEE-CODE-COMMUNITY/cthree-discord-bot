import { Test, TestingModule } from "@nestjs/testing"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { MoveStickyMessageToRecentUseCase } from "./move-sticky-message-to-recent.use-case"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { Message, OmitPartialGroupDMChannel } from "discord.js"
import { StickyMessage } from "../entities/sticky-message.entity"

describe("MoveStickyMessageToRecentUseCase", () => {
  let useCase: MoveStickyMessageToRecentUseCase
  let stickyMessageRepository: DeepMockProxy<StickyMessageRepository>
  let logger: DeepMockProxy<Logger>
  let interaction: DeepMockProxy<OmitPartialGroupDMChannel<Message<true>>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoveStickyMessageToRecentUseCase,
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

    useCase = module.get<MoveStickyMessageToRecentUseCase>(MoveStickyMessageToRecentUseCase)
    stickyMessageRepository = module.get(STICKY_MESSAGE_REPOSITORY)
    logger = module.get(LOGGER)
    interaction = mockDeep<OmitPartialGroupDMChannel<Message<true>>>()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    beforeEach(() => {
      interaction.channelId = "channel-123"
    })

    it("should do nothing if the author is a bot", async () => {
      interaction.author.bot = true

      await useCase.execute(interaction)

      expect(stickyMessageRepository.findByChannelId).not.toHaveBeenCalled()
    })

    it("should do nothing if no sticky message is found", async () => {
      interaction.author.bot = false
      stickyMessageRepository.findByChannelId.mockResolvedValue(null)

      await useCase.execute(interaction)

      expect(stickyMessageRepository.findByChannelId).toHaveBeenCalledWith("channel-123")
      expect(interaction.channel.messages.fetch).not.toHaveBeenCalled()
    })

    it("should move the sticky message to recent", async () => {
      interaction.author.bot = false

      const stickyMessage = new StickyMessage()
      stickyMessage.messageId = "old-message-id"
      stickyMessage.message = "This is a sticky message."
      stickyMessageRepository.findByChannelId.mockResolvedValue(stickyMessage)

      const oldMessage = mockDeep<Message<true>>()
      // @ts-ignore
      interaction.channel.messages.fetch.mockResolvedValue(oldMessage)

      const newMessage = mockDeep<Message>()
      newMessage.id = "new-message-id"
      // @ts-ignore
      interaction.channel.send.mockResolvedValue(newMessage)

      await useCase.execute(interaction)

      expect(stickyMessageRepository.findByChannelId).toHaveBeenCalledWith("channel-123")
      expect(interaction.channel.messages.fetch).toHaveBeenCalledWith("old-message-id")
      expect(oldMessage.delete).toHaveBeenCalled()
      expect(interaction.channel.send).toHaveBeenCalledWith("This is a sticky message.")
      // expect(stickyMessageRepository.updateByChannelId).toHaveBeenCalledWith("channel-123", {
      //   ...stickyMessage,
      //   messageId: "new-message-id",
      // })
      expect(stickyMessageRepository.updateByChannelId).toHaveBeenCalledWith("channel-123",
        Object.assign(stickyMessage, { messageId: "new-message-id" }),
      )
    })

    it("should log an error if moving the message fails", async () => {
      interaction.author.bot = false
      const error = new Error("Fetch failed")
      stickyMessageRepository.findByChannelId.mockRejectedValue(error)

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith("Error moving sticky message to recent", error)
    })
  })
})
