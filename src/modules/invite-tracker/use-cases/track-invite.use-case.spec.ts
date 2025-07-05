import { Test, TestingModule } from "@nestjs/testing"
import { TrackInviteUseCase } from "./track-invite.use-case"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { inviteCache } from "../constants/cache-collection.constants"
import { Collection, GuildMember, Invite, TextChannel, User } from "discord.js"

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const mockSecretManager = {
  getOrThrow: jest.fn(),
}

const createMockMember = (guildId: string, fetchesSuccessfully: boolean): GuildMember => {
  const mockChannel = {
    send: jest.fn().mockResolvedValue(true),
  }

  const mockGuild = {
    id: guildId,
    name: `Test Guild ${guildId}`,
    invites: {
      fetch: jest.fn().mockImplementation((): Promise<Collection<string, Invite>> => {
        if (!fetchesSuccessfully) {
          return Promise.reject(new Error("API Error"))
        }
        const newInvites = new Collection<string, Invite>()
        newInvites.set("invite-A", {
          code: "invite-A",
          uses: 6,
          inviter: { toString: () => "<@inviter-id>" } as unknown as User,
        } as Invite)
        newInvites.set("invite-B", { code: "invite-B", uses: 10 } as Invite)
        return Promise.resolve(newInvites)
      }),
    },
    channels: {
      cache: {
        get: jest.fn().mockReturnValue(mockChannel),
      },
    },
  }

  return {
    guild: mockGuild,
    user: {
      tag: "testuser#0001",
      displayAvatarURL: jest.fn().mockReturnValue("http://avatar.url"),
    },
    toString: () => "<@testuser-id>",
  } as unknown as GuildMember
}

describe("TrackInviteUseCase", () => {
  let useCase: TrackInviteUseCase

  beforeEach(async () => {
    jest.clearAllMocks()
    inviteCache.clear()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackInviteUseCase,
        { provide: LOGGER, useValue: mockLogger },
        { provide: SecretManager, useValue: mockSecretManager },
      ],
    }).compile()

    useCase = module.get<TrackInviteUseCase>(TrackInviteUseCase)
    mockSecretManager.getOrThrow.mockResolvedValue("channel-123")
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  it("should track and send an embed when an inviter is found", async () => {
    const initialInvites = new Collection<string, number>([
      ["invite-A", 5],
      ["invite-B", 10],
    ])
    inviteCache.set("guild-1", initialInvites)

    const mockMember = createMockMember("guild-1", true)

    await useCase.execute(mockMember)

    const mockChannel = mockMember.guild.channels.cache.get("channel-123") as TextChannel
    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_INVITE_CHANNEL_ID")
    expect(mockMember.guild.invites.fetch).toHaveBeenCalledTimes(1)

    expect(inviteCache.get("guild-1")?.get("invite-A")).toBe(6)

    expect(mockChannel.send).toHaveBeenCalledTimes(1)
    const sentEmbed = (mockChannel.send as jest.Mock).mock.calls[0][0].embeds[0]
    expect(sentEmbed.data.title).toContain("Member Baru Bergabung!")
    expect(sentEmbed.data.description).toContain("telah bergabung ke server.")
    expect(sentEmbed.data.fields).toEqual(expect.arrayContaining([expect.objectContaining({ name: "Diundang oleh" })]))
  })

  it("should send an embed for an unknown source if no invite use was tracked", async () => {
    const initialInvites = new Collection<string, number>([
      ["invite-A", 6],
      ["invite-B", 10],
    ])
    inviteCache.set("guild-1", initialInvites)
    const mockMember = createMockMember("guild-1", true)

    await useCase.execute(mockMember)

    const mockChannel = mockMember.guild.channels.cache.get("channel-123") as TextChannel
    expect(mockChannel.send).toHaveBeenCalledTimes(1)
    const sentEmbed = (mockChannel.send as jest.Mock).mock.calls[0][0].embeds[0]
    expect(sentEmbed.data.title).toContain("Sumber Tidak Diketahui")
  })

  it("should warn and return if invite cache is not found for the guild", async () => {
    const mockMember = createMockMember("guild-1", true)
    inviteCache.clear()

    await useCase.execute(mockMember)

    expect(mockLogger.warn).toHaveBeenCalledWith("Invite cache not found for guild: Test Guild guild-1")
    expect(mockMember.guild.invites.fetch).not.toHaveBeenCalled()
    const mockChannel = mockMember.guild.channels.cache.get("channel-123") as TextChannel
    expect(mockChannel.send).not.toHaveBeenCalled()
  })

  it("should log an error if any step in the process fails", async () => {
    const initialInvites = new Collection<string, number>([["invite-A", 5]])
    inviteCache.set("guild-1", initialInvites)
    const mockMember = createMockMember("guild-1", false)

    await useCase.execute(mockMember)

    expect(mockLogger.error).toHaveBeenCalledWith("Error in TrackInviteUseCase:", expect.any(Error))
  })
})
