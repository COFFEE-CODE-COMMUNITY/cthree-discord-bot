import { InputTakeRoleRolesUseCase } from "./input-take-role-roles.use-case"
import { ActionRowBuilder, RoleSelectMenuBuilder } from "discord.js"

describe("InputTakeRoleRolesUseCase", () => {
  let useCase: InputTakeRoleRolesUseCase

  beforeEach(() => {
    useCase = new InputTakeRoleRolesUseCase()
  })

  function createMockInteraction({
    isRepliable = true,
    replied = false,
    deferred = false,
  }: {
    isRepliable?: boolean
    replied?: boolean
    deferred?: boolean
  }): {
    isRepliable: () => boolean
    replied: boolean
    deferred: boolean
    reply: jest.Mock
    editReply: jest.Mock
  } {
    return {
      isRepliable: () => isRepliable,
      replied,
      deferred,
      reply: jest.fn(),
      editReply: jest.fn(),
    }
  }

  it("should return early if interaction is not repliable", async () => {
    const interaction = createMockInteraction({ isRepliable: false }) as any

    await useCase.execute(interaction)

    expect(interaction.reply).not.toHaveBeenCalled()
    expect(interaction.editReply).not.toHaveBeenCalled()
  })

  it("should call editReply if interaction was already replied or deferred", async () => {
    const interaction = createMockInteraction({ replied: true }) as any

    await useCase.execute(interaction)

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Silakan pilih satu atau lebih role"),
        components: expect.any(Array),
      }),
    )
  })

  it("should call reply if interaction was not yet replied or deferred", async () => {
    const interaction = createMockInteraction({ replied: false, deferred: false }) as any

    await useCase.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Silakan pilih satu atau lebih role"),
        components: expect.any(Array),
      }),
    )
  })

  it("should build role select menu correctly", async () => {
    const interaction = createMockInteraction({}) as any

    await useCase.execute(interaction)

    const [[response]] = (interaction.reply as jest.Mock).mock.calls

    expect(response.components).toHaveLength(1)

    const row = response.components[0] as ActionRowBuilder<RoleSelectMenuBuilder>
    const select = row.components[0]

    expect(select.data.custom_id).toBe("takeRoleSelectRoles")
    expect(select.data.placeholder).toBe("Pilih role yang ingin dimasukkan ke dalam embed")
    expect(select.data.min_values).toBe(1)
    expect(select.data.max_values).toBe(25)
  })
})
