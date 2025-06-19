import { HandleBoosterMessageUseCase } from "./handle-booster-message.use-case"
import { TextChannel, Message, Guild, GuildMember, User, Client, ChannelType } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger } from "../../../common/interfaces/logger/logger.interface"

// Mock dependencies
const mockSecretManager = {
  getOrThrow: jest.fn(),
} as unknown as SecretManager

const mockLogger: Logger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  info: jest.fn(),
  fatal: jest.fn(),
}

const mockUser = {
  username: "BoosterUser",
  displayAvatarURL: jest.fn().mockReturnValue("https://example.com/avatar.png"),
} as unknown as User

const mockMember = {
  id: "123456789",
  user: mockUser,
} as unknown as GuildMember

const mockGuild = {
  premiumTier: 2,
  premiumSubscriptionCount: 5,
} as unknown as Guild

const mockChannel = {
  send: jest.fn(),
  type: ChannelType.GuildText,
} as unknown as TextChannel

const mockClient = {
  channels: {
    fetch: jest.fn().mockResolvedValue(mockChannel),
  },
} as unknown as Client

const baseMessage = {
  content: "thanks for the boost!",
  type: 8,
  channelId: "boostChannelId",
  member: mockMember,
  guild: mockGuild,
  client: mockClient,
  delete: jest.fn(),
} as unknown as Message<true>

function cloneMessage(overrides: Record<string, unknown> = {}): Message<true> {
  const clone = Object.create(baseMessage)

  for (const [key, value] of Object.entries(overrides)) {
    clone[key] = value
  }

  if (typeof clone.delete !== "function") {
    clone.delete = jest.fn()
  }

  return clone
}

describe("HandleBoosterMessageUseCase", () => {
  let useCase: HandleBoosterMessageUseCase

  beforeEach(() => {
    jest.clearAllMocks()

    useCase = new HandleBoosterMessageUseCase(mockSecretManager, mockLogger)

    mockSecretManager.getOrThrow = jest.fn().mockImplementation((key: string) => {
      if (key === "C3_BOOST_CHANNEL_ID") return Promise.resolve("boostChannelId")
      if (key === "C3_PERKY") return Promise.resolve("customRoleId")
      throw new Error("Unknown key")
    })
  })

  it("should skip if message is not in boost channel", async () => {
    const message = cloneMessage({ channelId: "wrongChannel" })

    await useCase.execute(message)
    expect(mockSecretManager.getOrThrow).toHaveBeenCalled()
    expect(message.delete).not.toHaveBeenCalled()
  })

  it("should skip if message is not from a member", async () => {
    const message = cloneMessage({ member: null })

    await useCase.execute(message)
    expect(message.delete).not.toHaveBeenCalled()
  })

  it("should skip if message is not boost-related", async () => {
    const message = cloneMessage({ content: "just chatting", type: 0 })

    await useCase.execute(message)
    expect(message.delete).not.toHaveBeenCalled()
  })

  it("should delete message and send embed if valid", async () => {
    const message = cloneMessage()
    await useCase.execute(message)

    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_BOOST_CHANNEL_ID")
    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_PERKY")
    expect(message.delete).toHaveBeenCalled()
    expect(mockChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: `<@${mockMember.id}>`,
        embeds: expect.any(Array),
        files: expect.any(Array),
      }),
    )
  })

  it("should log error if channel is not a TextChannel", async () => {
    const mockInvalidChannel = {} as unknown as TextChannel
    mockClient.channels.fetch = jest.fn().mockResolvedValue(mockInvalidChannel)

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()

    const message = cloneMessage()
    await useCase.execute(message)

    expect(consoleErrorSpy).toHaveBeenCalledWith("Target channel bukan Text Channel.")
    consoleErrorSpy.mockRestore()
  })
})
