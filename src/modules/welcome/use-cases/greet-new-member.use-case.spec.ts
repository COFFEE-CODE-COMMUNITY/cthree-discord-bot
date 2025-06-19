import { Test, TestingModule } from "@nestjs/testing"
import { GreetNewMemberUseCase } from "./greet-new-member.use-case"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { mock, MockProxy } from "jest-mock-extended"
import { Collection, GuildMember, TextChannel } from "discord.js"
import { createCanvas, loadImage } from "@napi-rs/canvas"

jest.mock("@napi-rs/canvas", () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      drawImage: jest.fn(),
      fillText: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      closePath: jest.fn(),
      clip: jest.fn(),
    })),
    toBuffer: jest.fn(() => Buffer.from("test-buffer")),
  })),
  loadImage: jest.fn(() => Promise.resolve({ width: 1024, height: 500 })),
  GlobalFonts: {
    registerFromPath: jest.fn(),
  },
}))

describe("GreetNewMemberUseCase", () => {
  let useCase: GreetNewMemberUseCase
  let logger: MockProxy<Logger>
  let secretManager: MockProxy<SecretManager>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GreetNewMemberUseCase,
        { provide: LOGGER, useValue: mock<Logger>() },
        { provide: SecretManager, useValue: mock<SecretManager>() },
      ],
    }).compile()

    useCase = module.get<GreetNewMemberUseCase>(GreetNewMemberUseCase)
    logger = module.get(LOGGER)
    secretManager = module.get(SecretManager)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    const welcomeChannelId = "welcome-channel-id"
    let mockMember: GuildMember
    let mockChannel: MockProxy<TextChannel>

    beforeEach(() => {
      mockChannel = mock<TextChannel>()
      mockChannel.isTextBased.mockReturnValue(true)
      mockChannel.isSendable.mockReturnValue(true)

      mockMember = {
        user: {
          username: "TestUser",
          displayAvatarURL: () => "http://avatar.url",
        },
        guild: {
          channels: {
            cache: new Collection<string, any>([[welcomeChannelId, mockChannel]]),
          },
        },
        toString: () => "<@TestUser>",
      } as unknown as GuildMember

      secretManager.getOrThrow.calledWith("C3_WELCOME_CHANNEL_ID").mockResolvedValue(welcomeChannelId)
    })

    it("should send a welcome message with a banner to the correct channel", async () => {
      await useCase.execute(mockMember)

      expect(logger.verbose).toHaveBeenCalledWith("TestUser has joined the guild.")
      expect(secretManager.getOrThrow).toHaveBeenCalledWith("C3_WELCOME_CHANNEL_ID")
      expect(mockChannel.send).toHaveBeenCalledTimes(1)
      expect(mockChannel.send).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
          files: expect.any(Array),
        }),
      )
      expect(loadImage).toHaveBeenCalledTimes(2) // background and avatar
      expect(createCanvas).toHaveBeenCalledTimes(1)
    })

    it("should log an error if the welcome channel is not found", async () => {
      secretManager.getOrThrow.calledWith("C3_WELCOME_CHANNEL_ID").mockResolvedValue("non-existent-channel")

      await useCase.execute(mockMember)

      expect(logger.error).toHaveBeenCalledWith("Welcome channel not found.")
      expect(mockChannel.send).not.toHaveBeenCalled()
    })

    it("should log an error if the welcome channel is not text-based", async () => {
      mockChannel.isTextBased.mockReturnValue(false)

      await useCase.execute(mockMember)

      expect(logger.error).toHaveBeenCalledWith("Welcome channel is not TextBased.")
      expect(mockChannel.send).not.toHaveBeenCalled()
    })

    it("should log an error if the welcome channel is not sendable", async () => {
      mockChannel.isSendable.mockReturnValue(false)

      await useCase.execute(mockMember)

      expect(logger.error).toHaveBeenCalledWith("Welcome channel is not Sendable.")
      expect(mockChannel.send).not.toHaveBeenCalled()
    })
  })
})
