import { ChatInputCommandInteraction } from "discord.js"
import { mock, MockProxy } from "jest-mock-extended"
import { ClearAutoDeleteMessageUseCase } from "./clear-auto-delete-message.use-case"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"

describe("ClearAutoDeleteMessageUseCase", () => {
  let useCase: ClearAutoDeleteMessageUseCase
  let mockRepository: MockProxy<AutoDeleteMessageRepository>
  let mockInteraction: MockProxy<ChatInputCommandInteraction>

  beforeEach(() => {
    mockRepository = mock<AutoDeleteMessageRepository>()
    mockInteraction = mock<ChatInputCommandInteraction>()
    useCase = new ClearAutoDeleteMessageUseCase(mockRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should reply with error when guildId is null", async () => {
      // Arrange
      mockInteraction.guildId = null

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "This command can only be used in a guild.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByGuildId).not.toHaveBeenCalled()
    })

    it("should reply with error when guildId is undefined", async () => {
      // Arrange
      mockInteraction.guildId = undefined as any

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "This command can only be used in a guild.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByGuildId).not.toHaveBeenCalled()
    })

    it("should reply with error when guildId is empty string", async () => {
      // Arrange
      mockInteraction.guildId = ""

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "This command can only be used in a guild.",
        flags: "Ephemeral",
      })
      expect(mockRepository.deleteByGuildId).not.toHaveBeenCalled()
    })

    it("should successfully clear auto-delete messages for a valid guild", async () => {
      // Arrange
      const guildId = "guild123"
      mockInteraction.guildId = guildId
      mockRepository.deleteByGuildId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockRepository.deleteByGuildId).toHaveBeenCalledWith(guildId)
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto-delete message has cleared on this guild.",
        flags: "Ephemeral",
      })
    })

    it("should call deleteByGuildId with correct guildId", async () => {
      // Arrange
      const guildId = "specificGuild456"
      mockInteraction.guildId = guildId
      mockRepository.deleteByGuildId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockRepository.deleteByGuildId).toHaveBeenCalledTimes(1)
      expect(mockRepository.deleteByGuildId).toHaveBeenCalledWith(guildId)
    })

    it("should call interaction.reply twice for successful execution", async () => {
      // Arrange
      const guildId = "guild123"
      mockInteraction.guildId = guildId
      mockRepository.deleteByGuildId.mockResolvedValue(undefined)

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(mockInteraction.reply).toHaveBeenCalledTimes(1)
      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: "Auto-delete message has cleared on this guild.",
        flags: "Ephemeral",
      })
    })

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const guildId = "guild123"
      mockInteraction.guildId = guildId
      const repositoryError = new Error("Database connection failed")
      mockRepository.deleteByGuildId.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction)).rejects.toThrow(repositoryError)
      expect(mockRepository.deleteByGuildId).toHaveBeenCalledWith(guildId)
    })

    it("should handle interaction reply errors gracefully", async () => {
      // Arrange
      const guildId = "guild123"
      mockInteraction.guildId = guildId
      mockRepository.deleteByGuildId.mockResolvedValue(undefined)
      const replyError = new Error("Discord API error")
      mockInteraction.reply.mockRejectedValue(replyError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction)).rejects.toThrow(replyError)
      expect(mockRepository.deleteByGuildId).toHaveBeenCalledWith(guildId)
    })

    it("should handle repository deletion error without affecting first reply", async () => {
      // Arrange
      mockInteraction.guildId = null
      const replyError = new Error("Discord API error")
      mockInteraction.reply.mockRejectedValue(replyError)

      // Act & Assert
      await expect(useCase.execute(mockInteraction)).rejects.toThrow(replyError)
      expect(mockRepository.deleteByGuildId).not.toHaveBeenCalled()
    })

    it("should execute deletion before sending success reply", async () => {
      // Arrange
      const guildId = "guild123"
      mockInteraction.guildId = guildId
      const executionOrder: string[] = []

      mockRepository.deleteByGuildId.mockImplementation(async () => {
        executionOrder.push("repository")
      })

      mockInteraction.reply.mockImplementation(async (): Promise<any> => {
        executionOrder.push("reply")
      })

      // Act
      await useCase.execute(mockInteraction)

      // Assert
      expect(executionOrder).toEqual(["repository", "reply"])
    })
  })
})
