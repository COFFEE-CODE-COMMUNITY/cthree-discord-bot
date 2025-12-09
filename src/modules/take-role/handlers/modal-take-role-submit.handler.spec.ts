import { ModalSubmitInteraction } from "discord.js"
import { ModalTakeRoleSubmitHandler } from "./modal-take-role-submit.handler"
import { InputTakeRoleChannelUseCase } from "../use-cases/input-take-role-channel.use-case"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { takeRoleCache } from "../constants/take-role-cache.constant"

describe("ModalTakeRoleSubmitHandler", () => {
  let handler: ModalTakeRoleSubmitHandler
  let mockSecretManager: jest.Mocked<SecretManager>
  let mockInputTakeRoleChannel: jest.Mocked<InputTakeRoleChannelUseCase>

  const userId = "user123"
  const guildId = "guild456"

  const createMockInteraction = (customId = "takeRoleModal"): jest.Mocked<ModalSubmitInteraction> => {
    return {
      isModalSubmit: jest.fn().mockReturnValue(true),
      customId,
      fields: {
        getTextInputValue: jest.fn().mockImplementation((id: string) => {
          switch (id) {
            case "message":
              return "Optional footer message"
            case "embedTitle":
              return "Sample Title"
            case "embedBody":
              return "Sample Description"
            case "embedColor":
              return "#ff0000"
            case "imageUrl":
              return "https://example.com/image.png"
            default:
              return ""
          }
        }),
      },
      user: { id: userId },
      reply: jest.fn(),
    } as any
  }

  beforeEach(() => {
    mockSecretManager = {
      getOrThrow: jest.fn().mockResolvedValue(guildId),
    } as any

    mockInputTakeRoleChannel = {
      execute: jest.fn(),
    } as any

    handler = new ModalTakeRoleSubmitHandler(mockInputTakeRoleChannel, mockSecretManager)
    takeRoleCache.clear()
  })

  it("should ignore non-modal interactions", async () => {
    const interaction = createMockInteraction()
    interaction.isModalSubmit.mockReturnValue(false)

    await handler.execute(interaction)
    expect(interaction.reply).not.toHaveBeenCalled()
    expect(mockInputTakeRoleChannel.execute).not.toHaveBeenCalled()
  })

  it("should ignore modal with different customId", async () => {
    const interaction = createMockInteraction("wrongId")

    await handler.execute(interaction)
    expect(interaction.reply).not.toHaveBeenCalled()
    expect(mockInputTakeRoleChannel.execute).not.toHaveBeenCalled()
  })

  it("should store data in cache and reply correctly", async () => {
    const interaction = createMockInteraction()

    await handler.execute(interaction)

    const cached = takeRoleCache.get(userId)
    expect(cached).toBeDefined()
    expect(cached?.guildId).toBe(guildId)
    expect(cached?.embedTitle).toBe("Sample Title")
    expect(interaction.reply).toHaveBeenCalledWith({
      content: "Berhasil! Sekarang silakan pilih channel tujuan.",
      ephemeral: true,
    })
    expect(mockInputTakeRoleChannel.execute).toHaveBeenCalledWith(interaction)
  })
})
