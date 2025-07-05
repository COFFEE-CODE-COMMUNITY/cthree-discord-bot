import { Test, TestingModule } from "@nestjs/testing"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { CreateStickyMessageUseCase } from "./create-sticky-message.use-case"
import { STICKY_MESSAGE_SERVICE, StickyMessageService } from "../services/sticky-message.service"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { Client, ModalSubmitInteraction, ChannelType, TextChannel, Message } from "discord.js"

describe("CreateStickyMessageUseCase", () => {
  let useCase: CreateStickyMessageUseCase
  let stickyMessageService: DeepMockProxy<StickyMessageService>
  let stickyMessageRepository: DeepMockProxy<StickyMessageRepository>
  let logger: DeepMockProxy<Logger>
  let discordClient: DeepMockProxy<Client>
  let interaction: DeepMockProxy<ModalSubmitInteraction>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStickyMessageUseCase,
        {
          provide: STICKY_MESSAGE_SERVICE,
          useValue: mockDeep<StickyMessageService>(),
        },
        {
          provide: STICKY_MESSAGE_REPOSITORY,
          useValue: mockDeep<StickyMessageRepository>(),
        },
        {
          provide: LOGGER,
          useValue: mockDeep<Logger>(),
        },
        {
          provide: Client,
          useValue: mockDeep<Client>(),
        },
      ],
    }).compile()

    useCase = module.get<CreateStickyMessageUseCase>(CreateStickyMessageUseCase)
    stickyMessageService = module.get(STICKY_MESSAGE_SERVICE)
    stickyMessageRepository = module.get(STICKY_MESSAGE_REPOSITORY)
    logger = module.get(LOGGER)
    discordClient = module.get(Client)
    interaction = mockDeep<ModalSubmitInteraction>()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    const mockData = {
      message: "test message",
      guildId: "guild-123",
      userId: "user-123",
      channelId: "channel-123",
      messageId: "message-123",
    }

    beforeEach(() => {
      interaction.fields.getTextInputValue.mockReturnValue(mockData.message)
      interaction.guildId = mockData.guildId
      interaction.user.id = mockData.userId
      stickyMessageService.getTemporaryUser.mockReturnValue({ channelId: mockData.channelId })
    })

    it("should reply with an error if guildId is not found", async () => {
      interaction.guildId = null

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith(`Guild ID not found for user ${mockData.userId}.`)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "You must be in a server to create a sticky message.",
        flags: "Ephemeral",
      })
    })

    it("should reply with an error if channelId is not found", async () => {
      stickyMessageService.getTemporaryUser.mockReturnValue({ channelId: undefined })

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith(
        `Channel ID not found for user ${mockData.userId} in guild ${mockData.guildId}.`,
      )
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "You must select a channel before creating a sticky message.",
        flags: "Ephemeral",
      })
    })

    it("should reply with an error if channel type is not GuildText", async () => {
      // @ts-ignore
      const nonTextChannel = mockDeep<TextChannel>({ type: ChannelType.GuildVoice })
      discordClient.channels.fetch.mockResolvedValue(nonTextChannel as any)

      await useCase.execute(interaction)

      expect(interaction.reply).toHaveBeenCalledWith({
        content: "Channel type is not guild text.",
        flags: "Ephemeral",
      })
    })

    it("should create a sticky message successfully", async () => {
      const textChannel = mockDeep<TextChannel>()
      textChannel.type = ChannelType.GuildText
      textChannel.send.mockResolvedValue({ id: mockData.messageId } as Message<true>)
      discordClient.channels.fetch.mockResolvedValue(textChannel as any)

      await useCase.execute(interaction)

      expect(textChannel.send).toHaveBeenCalledWith(mockData.message)
      expect(stickyMessageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: mockData.message,
          messageId: mockData.messageId,
          guildId: mockData.guildId,
          channelId: mockData.channelId,
        }),
      )
      expect(stickyMessageService.deleteTemporaryUser).toHaveBeenCalledWith(mockData.userId)
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "Sticky message created successfully!",
        flags: "Ephemeral",
      })
    })

    it("should handle errors during sticky message creation", async () => {
      const error = new Error("DB error")
      const textChannel = mockDeep<TextChannel>()
      textChannel.type = ChannelType.GuildText
      textChannel.send.mockResolvedValue({ id: mockData.messageId } as Message<true>)
      discordClient.channels.fetch.mockResolvedValue(textChannel as any)
      stickyMessageRepository.create.mockRejectedValue(error)

      await useCase.execute(interaction)

      expect(logger.error).toHaveBeenCalledWith(
        `Failed to create sticky message for user ${mockData.userId} in guild ${mockData.guildId}:`,
        error,
      )
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "An error occurred while creating the sticky message. Please try again later.",
        flags: "Ephemeral",
      })
    })
  })
})
