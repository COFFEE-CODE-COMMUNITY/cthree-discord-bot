import { ChatInputCommandInteraction } from "discord.js"
import { mock, MockProxy } from "jest-mock-extended"
import { DisableAutoDeleteMessageUseCase } from "./disable-auto-delete-message.use-case"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { DisableAutoDeleteMessageDto } from "../dtos/disable-auto-delete-message.dto"

describe("DisableAutoDeleteMessageUseCase", () => {
  let useCase: DisableAutoDeleteMessageUseCase
  let mockRepository: MockProxy<AutoDeleteMessageRepository>
  let mockInteraction: MockProxy<ChatInputCommandInteraction>

  beforeEach(() => {
    mockRepository = mock<AutoDeleteMessageRepository>()
    mockInteraction = mock<ChatInputCommandInteraction>()
    useCase = new DisableAutoDeleteMessageUseCase(mockRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should reply with error when channelId is null from interaction and no channel option provided", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = null as any

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel id.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByChannelId).not.toHaveBeenCalled()
    })

    it("should reply with error when channelId is undefined from interaction and no channel option provided", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = undefined as any

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel id.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByChannelId).not.toHaveBeenCalled()
    })

    it("should disable auto-delete message using interaction channelId when no channel option provided", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should disable auto-delete message using provided channel option instead of interaction channelId", async () => {
      // Arrange
      const mockChannel = { id: "customChannel456" }
      const options: DisableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("customChannel456")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#customChannel456>",
        flags: "Ephemeral",
      })
    })

    it("should handle when channel option has no id property", async () => {
      // Arrange
      const mockChannel = {}
      const options: DisableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should handle when channel option is null", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = { channel: null as any }
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#channel123>",
        flags: "Ephemeral",
      })
    })

    it("should reply with error when both channel option and interaction channelId are invalid", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = { channel: null as any }
      mockInteraction.channelId = null as any

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Invalid channel id.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByChannelId).not.toHaveBeenCalled()
    })

    it("should prioritize channel option over interaction channelId when both are available", async () => {
      // Arrange
      const mockChannel = { id: "priorityChannel789" }
      const options: DisableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("priorityChannel789")
      expect(mockRepository.deleteByChannelId).not.toHaveBeenCalledWith("channel123")
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#priorityChannel789>",
        flags: "Ephemeral",
      })
    })

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = "channel123"
      const repositoryError = new Error("Database connection failed")
      mockRepository.deleteByChannelId.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction, options)).rejects.toThrow(repositoryError)
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
    })

    it("should handle interaction reply errors gracefully", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)
      const replyError = new Error("Discord API error")
      mockInteraction.reply.mockRejectedValue(replyError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction, options)).rejects.toThrow(replyError)
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
    })

    it("should call deleteByChannelId only once when successful", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledTimes(1)
      expect(mockRepository.deleteByChannelId).toHaveBeenCalledWith("channel123")
    })

    it("should call interaction.reply only once when successful", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockInteraction.channelId = "channel123"
      mockRepository.deleteByChannelId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction, options)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1)
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto delete message disabled for <#channel123>",
        flags: "Ephemeral",
      })
    })
  })
})
