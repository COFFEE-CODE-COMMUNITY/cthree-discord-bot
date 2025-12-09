import { ChatInputCommandInteraction } from "discord.js"
import { mock, MockProxy } from "jest-mock-extended"
import { EnableAutoDeleteMessageUseCase } from "./enable-auto-delete-message.use-case"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { AutoDeleteMessage } from "../entities/auto-delete-message.entity"

describe("EnableAutoDeleteMessageUseCase", () => {
  let useCase: EnableAutoDeleteMessageUseCase
  let mockRepository: MockProxy<AutoDeleteMessageRepository>
  let mockInteraction: MockProxy<ChatInputCommandInteraction>

  beforeEach(() => {
    mockRepository = mock<AutoDeleteMessageRepository>()
    mockInteraction = mock<ChatInputCommandInteraction>()
    useCase = new EnableAutoDeleteMessageUseCase(mockRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should reply with error when guildId is null", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = null
      mockInteraction.channelId = "channel123"

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel or guild ID.",
        flags: "Ephemeral",
      })
      expect(mockRepository.existsByChannelId).not.toHaveBeenCalled()
      expect(mockRepository.insert).not.toHaveBeenCalled()
    })

    it("should reply with error when channelId is null", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = null as any

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel or guild ID.",
        flags: "Ephemeral",
      })
      expect(mockRepository.existsByChannelId).not.toHaveBeenCalled()
      expect(mockRepository.insert).not.toHaveBeenCalled()
    })

    it("should reply with error when both guildId and channelId are null", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = null
      mockInteraction.channelId = null as any

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel or guild ID.",
        flags: "Ephemeral",
      })
      expect(mockRepository.existsByChannelId).not.toHaveBeenCalled()
      expect(mockRepository.insert).not.toHaveBeenCalled()
    })

    it("should reply that auto-delete is already enabled when channel already exists", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(true)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto-delete messages is already enabled for this channel.",
        flags: "Ephemeral",
      })
      expect(mockRepository.insert).not.toHaveBeenCalled()
    })

    it("should enable auto-delete message when channel does not exist", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          guildId: "guild123",
          channelId: "channel123",
        }),
      )
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message enabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should use provided channel option instead of interaction channelId", async () => {
      // Arrange
      const mockChannel = { id: "customChannel456" }
      const options: EnableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("customChannel456")
      expect(mockRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          guildId: "guild123",
          channelId: "customChannel456",
        }),
      )
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message enabled for <#customChannel456>",
        flags: "Ephemeral",
      })
    })

    it("should handle when channel option has no id property", async () => {
      // Arrange
      const mockChannel = {}
      const options: EnableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          guildId: "guild123",
          channelId: "channel123",
        }),
      )
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message enabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should handle when channel option is null", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = { channel: null as any }
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          guildId: "guild123",
          channelId: "channel123",
        }),
      )
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message enabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should create AutoDeleteMessage entity with correct properties", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.insert).toHaveBeenCalledWith(expect.any(AutoDeleteMessage))

      const insertedEntity = mockRepository.insert.mock.calls[0][0]
      expect(insertedEntity).toBeInstanceOf(AutoDeleteMessage)
      expect(insertedEntity.guildId).toBe("guild123")
      expect(insertedEntity.channelId).toBe("channel123")
    })

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      const repositoryError = new Error("Database connection failed")
      mockRepository.existsByChannelId.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction, options)).rejects.toThrow(repositoryError)
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockRepository.insert).not.toHaveBeenCalled()
    })

    it("should handle interaction reply errors gracefully", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockInteraction.guildId = "guild123"
      mockInteraction.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)
      mockRepository.insert.mockResolvedValue(undefined)
      const replyError = new Error("Discord API error")
      mockInteraction.reply.mockRejectedValue(replyError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction, options)).rejects.toThrow(replyError)
      expect(mockRepository.insert).toHaveBeenCalled()
    })
  })
})
