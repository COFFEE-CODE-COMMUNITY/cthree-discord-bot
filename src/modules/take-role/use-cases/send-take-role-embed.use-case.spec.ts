import { ButtonStyle, ChannelType, Collection, Guild, GuildBasedChannel, Role, TextChannel } from "discord.js"
import { SendTakeRoleEmbedUseCase } from "./send-take-role-embed.use-case"
import { ITakeRoleService } from "../services/take-role.service"

describe("SendTakeRoleEmbedUseCase", () => {
  let useCase: SendTakeRoleEmbedUseCase
  let mockTakeRoleService: jest.Mocked<ITakeRoleService>

  const fakeData = {
    id: "takeRole123",
    guildId: "guild1",
    userId: "user1",
    channelId: "channel1",
    roleIds: ["role1", "role2"],
    embedTitle: "Test Title",
    embedBody: "Test Description",
    embedColor: "#ff0000",
    imageUrl: "https://example.com/image.png",
    message: "Optional message",
    createdAt: new Date(),
  }

  const createMockGuild = (): { guild: Guild; sendMock: jest.Mock } => {
    const rolesCache = new Collection<string, Role>()
    rolesCache.set("role1", {
      id: "role1",
      name: "Admin",
      toString: () => "<@&role1>",
      valueOf: () => "role1",
    } as unknown as Role)

    rolesCache.set("role2", {
      id: "role2",
      name: "Member",
      toString: () => "<@&role2>",
      valueOf: () => "role2",
    } as unknown as Role)

    const sendMock = jest.fn()

    const textChannel = {
      id: "channel1",
      type: ChannelType.GuildText,
      send: sendMock,
      toString: () => "<#channel1>",
      valueOf: () => "channel1",
    } as unknown as TextChannel

    const channelsCache = new Collection<string, GuildBasedChannel>()
    channelsCache.set("channel1", textChannel)

    const mockGuild: Guild = {
      channels: {
        cache: channelsCache,
      },
      roles: {
        cache: rolesCache,
      },
    } as unknown as Guild

    return { guild: mockGuild, sendMock }
  }

  beforeEach(() => {
    mockTakeRoleService = {
      findById: jest.fn(),
    } as any

    useCase = new SendTakeRoleEmbedUseCase(mockTakeRoleService)
  })

  it("should throw error if take-role data is not found", async () => {
    mockTakeRoleService.findById.mockResolvedValue(null)
    const { guild } = createMockGuild()
    await expect(useCase.execute("nonexistent-id", guild)).rejects.toThrow("Take-role data not found")
  })

  it("should throw error if target channel is not found", async () => {
    mockTakeRoleService.findById.mockResolvedValue({ ...fakeData, channelId: "missingChannel" })
    const { guild } = createMockGuild()
    await expect(useCase.execute(fakeData.id, guild)).rejects.toThrow("Channel not found")
  })

  it("should send embed with buttons correctly", async () => {
    mockTakeRoleService.findById.mockResolvedValue(fakeData)
    const { guild, sendMock } = createMockGuild()

    await useCase.execute(fakeData.id, guild)

    const sent = sendMock.mock.calls[0][0]
    const embed = sent.embeds[0].toJSON()
    const buttons = sent.components[0].components.map((btn: any) => btn.toJSON())

    expect(sent.content).toBe(fakeData.message)

    expect(embed).toEqual({
      title: fakeData.embedTitle,
      description: fakeData.embedBody,
      color: 0xff0000,
      image: {
        url: fakeData.imageUrl,
      },
    })

    expect(buttons[0]).toMatchObject({
      custom_id: `takeRoleBtn:${fakeData.id}:role1`,
      label: "Admin",
      style: ButtonStyle.Primary,
      type: 2,
    })

    expect(buttons[1]).toMatchObject({
      custom_id: `takeRoleBtn:${fakeData.id}:role2`,
      label: "Member",
      style: ButtonStyle.Secondary,
      type: 2,
    })
  })

  it("should fallback to default role label if role not found in cache", async () => {
    const modifiedData = { ...fakeData, roleIds: ["missingRole"] }
    mockTakeRoleService.findById.mockResolvedValue(modifiedData)

    const { guild, sendMock } = createMockGuild()
    await useCase.execute(modifiedData.id, guild)

    const sent = sendMock.mock.calls[0][0]
    const fallbackButton = sent.components[0].components[0].toJSON()

    expect(fallbackButton.custom_id).toContain(`takeRoleBtn:${modifiedData.id}:missingRole`)
    expect(fallbackButton.label).toBe("Role 1")
    expect(fallbackButton.type).toBe(2)
  })
})
