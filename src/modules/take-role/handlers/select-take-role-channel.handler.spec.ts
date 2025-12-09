import { ChannelSelectMenuInteraction, User } from "discord.js"
import { SelectTakeRoleChannelHandler } from "./select-take-role-channel.handler"
import { InputTakeRoleRolesUseCase } from "../use-cases/input-take-role-roles.use-case"
import { takeRoleCache } from "../constants/take-role-cache.constant"

describe("SelectTakeRoleChannelHandler", () => {
  let handler: SelectTakeRoleChannelHandler
  let mockInputTakeRoleRolesUseCase: jest.Mocked<InputTakeRoleRolesUseCase>

  const userId = "user123"
  const channelId = "channel456"

  const createMockInteraction = (): ChannelSelectMenuInteraction => {
    const mock = {
      customId: "takeRoleSelectChannel",
      user: { id: userId } as User,
      values: [channelId],
      reply: jest.fn(),
      isChannelSelectMenu: (): boolean => true,
    }

    return mock as unknown as ChannelSelectMenuInteraction
  }

  beforeEach(() => {
    mockInputTakeRoleRolesUseCase = {
      execute: jest.fn(),
    } as any

    handler = new SelectTakeRoleChannelHandler(mockInputTakeRoleRolesUseCase)
    takeRoleCache.clear()
  })

  it("should reply if cache is missing", async () => {
    const interaction = createMockInteraction()

    await handler.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "Data take-role tidak ditemukan. Silakan mulai dari awal dengan /take-role create.",
      ephemeral: true,
    })
  })

  it("should proceed and update channelId", async () => {
    takeRoleCache.set(userId, {
      guildId: "guild-id",
      userId,
      roleIds: [],
      channelId: "",
      embedTitle: "Title",
      embedBody: "Body",
      embedColor: "#123456",
    })

    const interaction = createMockInteraction()

    await handler.execute(interaction)

    const updated = takeRoleCache.get(userId)
    expect(updated?.channelId).toBe(channelId)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Channel tujuan berhasil dipilih: <#${channelId}>. Sekarang pilih role yang ingin dimasukkan.`,
      ephemeral: true,
    })

    expect(mockInputTakeRoleRolesUseCase.execute).toHaveBeenCalledWith(interaction)
  })
})
