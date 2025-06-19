import { Test, TestingModule } from "@nestjs/testing"
import { HandleBoosterMessageUseCase } from "./handle-booster-message.use-case"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { Message, TextChannel, AttachmentBuilder, EmbedBuilder } from "discord.js"
import { BOOST_MESSAGE_TYPE } from "../constants/booster.constants"

const mockSecretManager = {
  getOrThrow: jest.fn(),
}

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

const mockUser = {
  id: "user-123",
  username: "testuser",
  displayAvatarURL: jest.fn().mockReturnValue("http://avatar.url/testuser.png"),
}

const mockGuild = {
  premiumTier: 2,
  premiumSubscriptionCount: 14,
}

const mockMember = {
  id: "user-123",
  user: mockUser,
}

const mockChannel = {
  send: jest.fn(),
}
Object.setPrototypeOf(mockChannel, TextChannel.prototype)

const mockClient = {
  channels: {
    fetch: jest.fn().mockResolvedValue(mockChannel),
  },
}

const createMockMessage = (overrides: object): Message<true> => {
  const baseMessage = {
    channelId: "boost-channel-id",
    content: "I just boosted the server!",
    type: "DEFAULT",
    member: mockMember,
    guild: mockGuild,
    client: mockClient,
    delete: jest.fn().mockResolvedValue(undefined),
  }
  return { ...baseMessage, ...overrides } as any
}

describe("HandleBoosterMessageUseCase", () => {
  let useCase: HandleBoosterMessageUseCase

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleBoosterMessageUseCase,
        { provide: SecretManager, useValue: mockSecretManager },
        { provide: LOGGER, useValue: mockLogger },
      ],
    }).compile()

    useCase = module.get<HandleBoosterMessageUseCase>(HandleBoosterMessageUseCase)

    mockSecretManager.getOrThrow.mockImplementation((key: string) => {
      if (key === "C3_BOOST_CHANNEL_ID") return "boost-channel-id"
      if (key === "C3_PERKY") return "custom-role-id"
      return ""
    })
    mockClient.channels.fetch.mockResolvedValue(mockChannel)
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  it("should do nothing if message is not in the boost channel", async () => {
    const message = createMockMessage({ channelId: "another-channel-id" })
    await useCase.execute(message)

    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_BOOST_CHANNEL_ID")
    expect(message.delete).not.toHaveBeenCalled()
    expect(mockChannel.send).not.toHaveBeenCalled()
  })

  it("should successfully process a valid boost message", async () => {
    const message = createMockMessage({})
    await useCase.execute(message)

    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_BOOST_CHANNEL_ID")
    expect(mockSecretManager.getOrThrow).toHaveBeenCalledWith("C3_PERKY")
    expect(message.delete).toHaveBeenCalled()
    expect(mockClient.channels.fetch).toHaveBeenCalledWith("boost-channel-id")
    expect(mockChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: `<@${mockMember.id}>`,
        embeds: [expect.any(EmbedBuilder)],
        files: [expect.any(AttachmentBuilder)],
      }),
    )
  })

  it('should do nothing if message does not contain "boost" and is not a boost type', async () => {
    const message = createMockMessage({ content: "just a regular message", type: "DEFAULT" })
    await useCase.execute(message)
    expect(message.delete).not.toHaveBeenCalled()
  })

  it("should process a message if it is a boost type", async () => {
    const message = createMockMessage({ content: "thank you!", type: BOOST_MESSAGE_TYPE[0] })
    await useCase.execute(message)
    expect(message.delete).toHaveBeenCalled()
  })

  it("should do nothing if message author is not a guild member", async () => {
    const message = createMockMessage({ member: null })
    await useCase.execute(message)
    expect(message.delete).not.toHaveBeenCalled()
  })

  it("should log an error if the target channel is not a TextChannel", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
    const nonTextChannel = { type: "voice" }
    mockClient.channels.fetch.mockResolvedValue(nonTextChannel)

    const message = createMockMessage({})
    await useCase.execute(message)

    expect(message.delete).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Target channel bukan Text Channel.")
    consoleErrorSpy.mockRestore()
  })
})
