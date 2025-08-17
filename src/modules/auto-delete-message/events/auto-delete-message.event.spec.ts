import { mock, MockProxy } from "jest-mock-extended"
import { AutoDeleteMessageEvent } from "./auto-delete-message.event"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { Message } from "discord.js"

describe("AutoDeleteMessageEvent", () => {
  let event: AutoDeleteMessageEvent
  let mockRepository: MockProxy<AutoDeleteMessageRepository>
  let mockMessage: MockProxy<Message>

  beforeEach(() => {
    mockRepository = mock<AutoDeleteMessageRepository>()
    mockMessage = mock<Message>()
    event = new AutoDeleteMessageEvent(mockRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("onMessageCreate", () => {
    it("should return early when message is from a bot", async () => {
      // Arrange
      mockMessage.author = { bot: true } as any
      mockMessage.channelId = "channel123"

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).not.toHaveBeenCalled()
      expect(mockMessage.delete).not.toHaveBeenCalled()
    })

    it("should not delete message when channel is not in auto-delete list", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).not.toHaveBeenCalled()
    })

    it("should delete message when channel is in auto-delete list", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(true)
      mockMessage.delete.mockResolvedValue(mockMessage as any)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).toHaveBeenCalledTimes(1)
    })

    it("should check repository with correct channelId", async () => {
      // Arrange
      const channelId = "specificChannel456"
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = channelId
      mockRepository.existsByChannelId.mockResolvedValue(false)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith(channelId)
      expect(mockRepository.existsByChannelId).toHaveBeenCalledTimes(1)
    })

    it("should handle repository errors gracefully", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      const repositoryError = new Error("Database connection failed")
      mockRepository.existsByChannelId.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(event.onMessageCreate([mockMessage as any])).rejects.toThrow(repositoryError)
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).not.toHaveBeenCalled()
    })

    it("should handle message deletion errors gracefully", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(true)
      const deleteError = new Error("Missing permissions")
      mockMessage.delete.mockRejectedValue(deleteError)

      // Act & Assert
      await expect(event.onMessageCreate([mockMessage as any])).rejects.toThrow(deleteError)
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).toHaveBeenCalledTimes(1)
    })

    it("should not call delete when repository check returns false", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(false)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).toHaveBeenCalledTimes(0)
    })

    it("should handle messages from users (non-bot)", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = "channel123"
      mockRepository.existsByChannelId.mockResolvedValue(true)
      mockMessage.delete.mockResolvedValue(mockMessage as any)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith("channel123")
      expect(mockMessage.delete).toHaveBeenCalledTimes(1)
    })

    it("should process messages with different channel IDs correctly", async () => {
      // Arrange
      const testCases = [
        { channelId: "channel1", shouldExist: true },
        { channelId: "channel2", shouldExist: false },
        { channelId: "channel3", shouldExist: true },
      ]

      for (const testCase of testCases) {
        // Reset mocks for each iteration
        jest.clearAllMocks()

        mockMessage.author = { bot: false } as any
        mockMessage.channelId = testCase.channelId
        mockRepository.existsByChannelId.mockResolvedValue(testCase.shouldExist)
        mockMessage.delete.mockResolvedValue(mockMessage as any)

        // Act
        await event.onMessageCreate([mockMessage as any])

        // Assert
        expect(mockRepository.existsByChannelId).toHaveBeenCalledWith(testCase.channelId)
        if (testCase.shouldExist) {
          expect(mockMessage.delete).toHaveBeenCalledTimes(1)
        } else {
          expect(mockMessage.delete).not.toHaveBeenCalled()
        }
      }
    })

    it("should handle undefined or null channelId", async () => {
      // Arrange
      mockMessage.author = { bot: false } as any
      mockMessage.channelId = null as any
      mockRepository.existsByChannelId.mockResolvedValue(false)

      // Act
      await event.onMessageCreate([mockMessage as any])

      // Assert
      expect(mockRepository.existsByChannelId).toHaveBeenCalledWith(null)
      expect(mockMessage.delete).not.toHaveBeenCalled()
    })
  })
})
