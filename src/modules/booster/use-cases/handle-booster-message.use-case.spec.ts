import { HandleBoosterMessageUseCase } from "./handle-booster-message.use-case"
import { TextChannel, Message } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger } from "../../../common/interfaces/logger/logger.interface"

describe("HandleBoosterMessageUseCase", () => {
  let useCase: HandleBoosterMessageUseCase
  let secret: SecretManager
  let logger: Logger

  beforeEach(() => {
    secret = {
      getOrThrow: jest.fn((key: string) => {
        if (key === "C3_BOOST_CHANNEL_ID") return "boost-channel-id"
        if (key === "C3_PERKY") return "custom-role-id"
        throw new Error("Unexpected key")
      }),
    } as unknown as SecretManager

    logger = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      fatal: jest.fn(),
      verbose: jest.fn(),
      trace: jest.fn(),
    }

    useCase = new HandleBoosterMessageUseCase(secret, logger)
  })

  it("should delete message and send embed if valid", async () => {
    const mockSend = jest.fn()
    const mockDelete = jest.fn().mockResolvedValue(undefined)

    const mockChannel = {
      send: mockSend,
    } as unknown as TextChannel

    const message = {
      content: "Thanks for the boost!",
      type: 0, // assumed BOOST_MESSAGE_TYPE includes 0
      channelId: "boost-channel-id",
      delete: mockDelete,
      member: {
        id: "123",
        user: {
          username: "Fauzi",
          displayAvatarURL: jest.fn(() => "https://avatar.url"),
        },
      },
      guild: {
        premiumTier: 2,
        premiumSubscriptionCount: 10,
      },
      client: {
        channels: {
          fetch: jest.fn().mockResolvedValue(mockChannel),
        },
      },
    } as unknown as Message<true>

    await useCase.execute(message)

    expect(mockDelete).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "<@123>",
        embeds: expect.any(Array),
        files: expect.any(Array),
      }),
    )
  })

  it("should log error if channel is not a TextChannel", async () => {
    const mockDelete = jest.fn().mockResolvedValue(undefined)

    const message = {
      content: "boost",
      type: 0,
      channelId: "boost-channel-id",
      delete: mockDelete,
      member: {
        id: "321",
        user: {
          username: "User",
          displayAvatarURL: jest.fn(() => "https://avatar.url"),
        },
      },
      guild: {
        premiumTier: 1,
        premiumSubscriptionCount: 5,
      },
      client: {
        channels: {
          fetch: jest.fn().mockResolvedValue({}), // not a TextChannel
        },
      },
    } as unknown as Message<true>

    const consoleError = jest.spyOn(console, "error").mockImplementation()

    await useCase.execute(message)

    expect(mockDelete).toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith("Target channel bukan Text Channel.")

    consoleError.mockRestore()
  })

  it("should skip if channelId not match", async () => {
    const message = {
      content: "boost",
      type: 0,
      channelId: "wrong-channel-id",
      member: {
        user: {},
      },
    } as unknown as Message<true>

    await expect(useCase.execute(message)).resolves.toBeUndefined()
  })

  it("should skip if member is undefined", async () => {
    const message = {
      content: "boost",
      type: 0,
      channelId: "boost-channel-id",
      member: undefined,
    } as unknown as Message<true>

    await expect(useCase.execute(message)).resolves.toBeUndefined()
  })

  it("should skip if message is not boost related", async () => {
    const message = {
      content: "hello",
      type: 99, // not in BOOST_MESSAGE_TYPE
      channelId: "boost-channel-id",
      member: {
        user: {},
      },
    } as unknown as Message<true>

    await expect(useCase.execute(message)).resolves.toBeUndefined()
  })
})
