import { InputTakeRoleChannelUseCase } from "./input-take-role-channel.use-case"
import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } from "discord.js"

describe("InputTakeRoleChannelUseCase", () => {
  let useCase: InputTakeRoleChannelUseCase

  beforeEach(() => {
    useCase = new InputTakeRoleChannelUseCase()
  })

  function createMockInteraction(options: { isRepliable?: boolean; replied?: boolean; deferred?: boolean }): {
    isRepliable: () => boolean
    replied: boolean
    deferred: boolean
    reply: jest.Mock
    editReply: jest.Mock
  } {
    const { isRepliable = true, replied = false, deferred = false } = options

    return {
      isRepliable: () => isRepliable,
      replied,
      deferred,
      reply: jest.fn(),
      editReply: jest.fn(),
    }
  }

  it("should return early if interaction is not repliable", async () => {
    const interaction = createMockInteraction({ isRepliable: false })

    await useCase.execute(interaction as any)

    expect(interaction.reply).not.toHaveBeenCalled()
    expect(interaction.editReply).not.toHaveBeenCalled()
  })

  it("should call editReply if interaction was already replied or deferred", async () => {
    const interaction = createMockInteraction({ replied: true }) as any

    await useCase.execute(interaction)

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Silakan pilih channel"),
        components: expect.any(Array),
      }),
    )
  })

  it("should call reply if interaction was not yet replied or deferred", async () => {
    const interaction = createMockInteraction({ replied: false, deferred: false }) as any

    await useCase.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Silakan pilih channel"),
        components: expect.any(Array),
      }),
    )
  })

  it("should build the correct select menu and row structure", async () => {
    const interaction = createMockInteraction({ replied: false }) as any

    await useCase.execute(interaction)

    const [[response]] = (interaction.reply as jest.Mock).mock.calls

    expect(response.content).toContain("Silakan pilih channel")
    expect(response.components).toHaveLength(1)

    const row = response.components[0] as ActionRowBuilder<ChannelSelectMenuBuilder>
    const select = row.components[0]

    expect(select.data.custom_id).toBe("takeRoleSelectChannel")
    expect(select.data.placeholder).toBe("Pilih channel tujuan pengiriman embed")
    expect(select.data.channel_types).toContain(ChannelType.GuildText)
    expect(select.data.min_values).toBe(1)
    expect(select.data.max_values).toBe(1)
  })
})
