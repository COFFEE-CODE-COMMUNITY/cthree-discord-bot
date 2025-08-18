import { mock, MockProxy } from "jest-mock-extended"
import { AutoDeleteMessageCommand } from "./auto-delete-message.command"
import { EnableAutoDeleteMessageUseCase } from "../use-cases/enable-auto-delete-message.use-case"
import { DisableAutoDeleteMessageUseCase } from "../use-cases/disable-auto-delete-message.use-case"
import { ClearAutoDeleteMessageUseCase } from "../use-cases/clear-auto-delete-message.use-case"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { DisableAutoDeleteMessageDto } from "../dtos/disable-auto-delete-message.dto"
import { ChatInputCommandInteraction } from "discord.js"

describe("AutoDeleteMessageCommand", () => {
  let command: AutoDeleteMessageCommand
  let mockEnableUseCase: MockProxy<EnableAutoDeleteMessageUseCase>
  let mockDisableUseCase: MockProxy<DisableAutoDeleteMessageUseCase>
  let mockClearUseCase: MockProxy<ClearAutoDeleteMessageUseCase>
  let mockInteraction: MockProxy<ChatInputCommandInteraction>

  beforeEach(() => {
    mockEnableUseCase = mock<EnableAutoDeleteMessageUseCase>()
    mockDisableUseCase = mock<DisableAutoDeleteMessageUseCase>()
    mockClearUseCase = mock<ClearAutoDeleteMessageUseCase>()
    mockInteraction = mock<ChatInputCommandInteraction>()

    command = new AutoDeleteMessageCommand(mockEnableUseCase, mockDisableUseCase, mockClearUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("enable", () => {
    it("should call enableAutoDeleteMessageUseCase.execute with correct parameters", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockEnableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.enable([mockInteraction], options)

      // Assert
      expect(mockEnableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
      expect(mockEnableUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should call enableAutoDeleteMessageUseCase.execute with channel option", async () => {
      // Arrange
      const mockChannel = { id: "channel123" }
      const options: EnableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockEnableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.enable([mockInteraction], options)

      // Assert
      expect(mockEnableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
      expect(mockEnableUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should handle useCase errors gracefully", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      const useCaseError = new Error("Use case execution failed")
      mockEnableUseCase.execute.mockRejectedValue(useCaseError)

      // Act & Assert
      await expect(command.enable([mockInteraction], options)).rejects.toThrow(useCaseError)
      expect(mockEnableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
    })

    it("should not call other use cases when enable is called", async () => {
      // Arrange
      const options: EnableAutoDeleteMessageDto = {}
      mockEnableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.enable([mockInteraction], options)

      // Assert
      expect(mockDisableUseCase.execute).not.toHaveBeenCalled()
      expect(mockClearUseCase.execute).not.toHaveBeenCalled()
    })
  })

  describe("disable", () => {
    it("should call disableAutoDeleteMessageUseCase.execute with correct parameters", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockDisableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.disable([mockInteraction], options)

      // Assert
      expect(mockDisableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
      expect(mockDisableUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should call disableAutoDeleteMessageUseCase.execute with channel option", async () => {
      // Arrange
      const mockChannel = { id: "channel456" }
      const options: DisableAutoDeleteMessageDto = { channel: mockChannel as any }
      mockDisableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.disable([mockInteraction], options)

      // Assert
      expect(mockDisableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
      expect(mockDisableUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should handle useCase errors gracefully", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      const useCaseError = new Error("Use case execution failed")
      mockDisableUseCase.execute.mockRejectedValue(useCaseError)

      // Act & Assert
      await expect(command.disable([mockInteraction], options)).rejects.toThrow(useCaseError)
      expect(mockDisableUseCase.execute).toHaveBeenCalledWith(mockInteraction, options)
    })

    it("should not call other use cases when disable is called", async () => {
      // Arrange
      const options: DisableAutoDeleteMessageDto = {}
      mockDisableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.disable([mockInteraction], options)

      // Assert
      expect(mockEnableUseCase.execute).not.toHaveBeenCalled()
      expect(mockClearUseCase.execute).not.toHaveBeenCalled()
    })
  })

  describe("clear", () => {
    it("should call clearAutoDeleteMessageUseCase.execute with correct parameters", async () => {
      // Arrange
      mockClearUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.clear([mockInteraction])

      // Assert
      expect(mockClearUseCase.execute).toHaveBeenCalledWith(mockInteraction)
      expect(mockClearUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should handle useCase errors gracefully", async () => {
      // Arrange
      const useCaseError = new Error("Use case execution failed")
      mockClearUseCase.execute.mockRejectedValue(useCaseError)

      // Act & Assert
      await expect(command.clear([mockInteraction])).rejects.toThrow(useCaseError)
      expect(mockClearUseCase.execute).toHaveBeenCalledWith(mockInteraction)
    })

    it("should not call other use cases when clear is called", async () => {
      // Arrange
      mockClearUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.clear([mockInteraction])

      // Assert
      expect(mockEnableUseCase.execute).not.toHaveBeenCalled()
      expect(mockDisableUseCase.execute).not.toHaveBeenCalled()
    })

    it("should only require interaction parameter for clear command", async () => {
      // Arrange
      mockClearUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.clear([mockInteraction])

      // Assert
      expect(mockClearUseCase.execute).toHaveBeenCalledWith(mockInteraction)
      // Verify no options parameter is passed
      expect(mockClearUseCase.execute.mock.calls[0]).toHaveLength(1)
    })
  })

  describe("constructor", () => {
    it("should properly inject all use case dependencies", () => {
      // Arrange & Act
      const newCommand = new AutoDeleteMessageCommand(mockEnableUseCase, mockDisableUseCase, mockClearUseCase)

      // Assert
      expect(newCommand).toBeInstanceOf(AutoDeleteMessageCommand)
      // Verify that the command can be instantiated without errors
      expect(newCommand).toBeDefined()
    })
  })

  describe("integration", () => {
    it("should handle multiple sequential command calls correctly", async () => {
      // Arrange
      const enableOptions: EnableAutoDeleteMessageDto = {}
      const disableOptions: DisableAutoDeleteMessageDto = {}

      mockEnableUseCase.execute.mockResolvedValue(undefined)
      mockDisableUseCase.execute.mockResolvedValue(undefined)
      mockClearUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.enable([mockInteraction], enableOptions)
      await command.disable([mockInteraction], disableOptions)
      await command.clear([mockInteraction])

      // Assert
      expect(mockEnableUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockDisableUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockClearUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should maintain isolation between different command calls", async () => {
      // Arrange
      const enableOptions: EnableAutoDeleteMessageDto = {}
      mockEnableUseCase.execute.mockResolvedValue(undefined)

      // Act
      await command.enable([mockInteraction], enableOptions)

      // Assert - Other use cases should not be affected
      expect(mockEnableUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockDisableUseCase.execute).not.toHaveBeenCalled()
      expect(mockClearUseCase.execute).not.toHaveBeenCalled()
    })
  })
})
