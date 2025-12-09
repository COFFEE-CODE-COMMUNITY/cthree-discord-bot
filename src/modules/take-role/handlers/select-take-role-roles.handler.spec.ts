import { RoleSelectMenuInteraction, Guild, User } from "discord.js"
import { SelectTakeRoleRolesHandler } from "./select-take-role-roles.handler"
import { takeRoleCache } from "../constants/take-role-cache.constant"
import { SendTakeRoleEmbedUseCase } from "../use-cases/send-take-role-embed.use-case"
import { ITakeRoleService } from "../services/take-role.service"
import { TakeRole } from "../entities/take-role.entity"

describe("SelectTakeRoleRolesHandler", () => {
  let handler: SelectTakeRoleRolesHandler
  let mockTakeRoleService: jest.Mocked<ITakeRoleService>
  let mockSendEmbedUseCase: jest.Mocked<SendTakeRoleEmbedUseCase>

  const userId = "user123"
  const channelId = "channel123"
  const guildId = "guild456"
  const selectedRoleIds = ["role1", "role2"]

  const createMockInteraction = (): RoleSelectMenuInteraction => {
    return {
      customId: "takeRoleSelectRoles",
      user: { id: userId } as User,
      values: selectedRoleIds,
      reply: jest.fn(),
      guild: { id: guildId } as Guild,
    } as unknown as RoleSelectMenuInteraction
  }

  beforeEach(() => {
    mockTakeRoleService = {
      create: jest.fn(),
    } as any

    mockSendEmbedUseCase = {
      execute: jest.fn(),
    } as any

    handler = new SelectTakeRoleRolesHandler(mockTakeRoleService, mockSendEmbedUseCase)
    takeRoleCache.clear()
  })

  it("should return early if customId is incorrect", async () => {
    const interaction = createMockInteraction()
    interaction.customId = "wrongId"

    await handler.execute(interaction)

    expect(mockTakeRoleService.create).not.toHaveBeenCalled()
    expect(mockSendEmbedUseCase.execute).not.toHaveBeenCalled()
  })

  it("should reply error if cache is missing or incomplete", async () => {
    const interaction = createMockInteraction()

    await handler.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "Data take-role tidak lengkap. Silakan mulai ulang dengan /take-role create.",
      ephemeral: true,
    })

    expect(mockTakeRoleService.create).not.toHaveBeenCalled()
  })

  it("should create take-role and send embed", async () => {
    const interaction = createMockInteraction()

    takeRoleCache.set(userId, {
      guildId: guildId,
      userId,
      channelId,
      roleIds: [],
      embedTitle: "Title",
      embedBody: "Body",
      embedColor: "#123456",
      message: "optional",
      imageUrl: undefined,
    })

    const fakeCreated: TakeRole = {
      id: "takeRoleId123",
      guildId: guildId,
      userId: userId,
      channelId: channelId,
      roleIds: selectedRoleIds,
      embedTitle: "Test Title",
      embedBody: "Test Body",
      embedColor: "#ffffff",
      message: "optional",
      imageUrl: undefined,
      createdAt: new Date(),
    }

    mockTakeRoleService.create.mockResolvedValue(fakeCreated)

    await handler.execute(interaction)

    expect(mockTakeRoleService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        roleIds: selectedRoleIds,
        channelId,
      }),
    )

    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.stringContaining("Take-role berhasil dibuat"),
      ephemeral: true,
    })

    expect(mockSendEmbedUseCase.execute).toHaveBeenCalledWith(fakeCreated.id, interaction.guild)
  })
})
