import { ButtonInteraction, Guild, GuildMember, Role } from "discord.js"
import { ButtonTakeRoleInteractionHandler } from "./button-take-role-interaction.handler"

describe("ButtonTakeRoleInteractionHandler", () => {
  let handler: ButtonTakeRoleInteractionHandler

  beforeEach(() => {
    handler = new ButtonTakeRoleInteractionHandler()
  })

  function createMockInteraction(options: {
    customId: string
    guild?: Partial<Guild> | null
    rolesInGuild?: Record<string, Partial<Role>>
    memberHasRole?: boolean
  }): ButtonInteraction {
    const { customId, guild = {}, rolesInGuild = {}, memberHasRole = false } = options

    const rolesCache = new Map<string, Role>()
    const roleIds = Object.keys(rolesInGuild)

    roleIds.forEach(id => {
      rolesCache.set(id, rolesInGuild[id] as Role)
    })

    const member = {
      roles: {
        cache: {
          has: jest.fn().mockReturnValue(memberHasRole),
        },
        add: jest.fn(),
        remove: jest.fn(),
      },
    } as unknown as GuildMember

    const mockGuild =
      guild === null
        ? null
        : ({
            roles: {
              cache: rolesCache,
            },
          } as unknown as Guild)

    const interaction = {
      customId,
      guild: mockGuild,
      member,
      reply: jest.fn(),
    } as unknown as ButtonInteraction

    return interaction
  }

  it('should do nothing if customId does not start with "takeRoleBtn:"', async () => {
    const interaction = createMockInteraction({
      customId: "invalidBtn",
    })

    await handler.execute(interaction)
    expect(interaction.reply).not.toHaveBeenCalled()
  })

  it("should reply if interaction is not in a guild", async () => {
    const interaction = createMockInteraction({
      customId: "takeRoleBtn:123:456",
      guild: null,
    })

    await handler.execute(interaction)
    expect(interaction.reply).toHaveBeenCalledWith({
      content: "Interaction ini hanya bisa digunakan di dalam server.",
      ephemeral: true,
    })
  })

  it("should reply if role is not found in guild", async () => {
    const interaction = createMockInteraction({
      customId: "takeRoleBtn:123:notfound",
      guild: {},
      rolesInGuild: {},
    })

    await handler.execute(interaction)
    expect(interaction.reply).toHaveBeenCalledWith({
      content: "Role tidak ditemukan.",
      ephemeral: true,
    })
  })

  it("should remove role if member already has it", async () => {
    const roleId = "role123"
    const role = {
      id: roleId,
      name: "Member",
    } as Role

    const interaction = createMockInteraction({
      customId: `takeRoleBtn:abc:${roleId}`,
      guild: {},
      rolesInGuild: {
        [roleId]: role,
      },
      memberHasRole: true,
    })

    await handler.execute(interaction)
    const member = interaction.member as GuildMember

    expect(member.roles.remove).toHaveBeenCalledWith(roleId)
    expect(interaction.reply).toHaveBeenCalledWith({
      content: `✅ Role **${role.name}** berhasil dihapus dari kamu.`,
      ephemeral: true,
    })
  })

  it("should add role if member does not have it", async () => {
    const roleId = "role456"
    const role = {
      id: roleId,
      name: "Admin",
    } as Role

    const interaction = createMockInteraction({
      customId: `takeRoleBtn:abc:${roleId}`,
      guild: {},
      rolesInGuild: {
        [roleId]: role,
      },
      memberHasRole: false,
    })

    await handler.execute(interaction)
    const member = interaction.member as GuildMember

    expect(member.roles.add).toHaveBeenCalledWith(roleId)
    expect(interaction.reply).toHaveBeenCalledWith({
      content: `✅ Kamu telah diberi role **${role.name}**.`,
      ephemeral: true,
    })
  })
})
