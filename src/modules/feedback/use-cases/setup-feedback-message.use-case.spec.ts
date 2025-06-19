import { DeepMockProxy, mockDeep, mock } from "jest-mock-extended"
import { Channel, Client, Collection, Message, MessagePayloadOption, TextChannel } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger } from "../../../common/interfaces/logger/logger.interface"
import { SetupFeedbackMessageUseCase } from "./setup-feedback-message.use-case"

describe("SetupFeedbackMessageUseCase", () => {
  let useCase: SetupFeedbackMessageUseCase
  let secretManager: DeepMockProxy<SecretManager>
  let logger: DeepMockProxy<Logger>
  let client: DeepMockProxy<Client>

  const FEEDBACK_CHANNEL_ID = "feedback-channel-id"

  beforeEach(() => {
    secretManager = mockDeep<SecretManager>()
    logger = mockDeep<Logger>()
    client = mockDeep<Client>()
    useCase = new SetupFeedbackMessageUseCase(secretManager, logger)
  })

  it("should log an error if the feedback channel is not found", async () => {
    secretManager.getOrThrow.mockResolvedValue(FEEDBACK_CHANNEL_ID)
    client.channels.fetch.mockResolvedValue(null)

    await useCase.execute(client)

    expect(secretManager.getOrThrow).toHaveBeenCalledWith("C3_FEEDBACK_CHANNEL_ID")
    expect(client.channels.fetch).toHaveBeenCalledWith(FEEDBACK_CHANNEL_ID)
    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${FEEDBACK_CHANNEL_ID} not found.`)
  })

  it("should log an error if the channel is not text-based", async () => {
    const mockChannel = mock<Channel>()
    secretManager.getOrThrow.mockResolvedValue(FEEDBACK_CHANNEL_ID)
    client.channels.fetch.mockResolvedValue(mockChannel)

    await useCase.execute(client)

    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${FEEDBACK_CHANNEL_ID} is not a text channel.`)
  })

  it("should log an error if the channel is not sendable", async () => {
    const mockChannel = mock<Channel>()
    mockChannel.isTextBased.mockReturnValue(true)
    secretManager.getOrThrow.mockResolvedValue(FEEDBACK_CHANNEL_ID)
    client.channels.fetch.mockResolvedValue(mockChannel)

    await useCase.execute(client)

    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${FEEDBACK_CHANNEL_ID} is not sendable.`)
  })

  it("should log info and do nothing if a message already exists in the channel", async () => {
    // const mockChannel = {
    //   isTextBased: () => true,
    //   isSendable: () => true,
    //   messages: {
    //     fetch: jest.fn().mockResolvedValue(new Collection([["some-id", {}]])),
    //   },
    //   send: jest.fn(),
    // }
    const mockChannel = mockDeep<TextChannel>()
    mockChannel.isTextBased.mockReturnValue(true)
    mockChannel.isSendable.mockReturnValue(true)
    mockChannel.messages.fetch.mockResolvedValue(new Collection([["some-id", mockDeep<Message>() as Message<true>]]))
    secretManager.getOrThrow.mockResolvedValue(FEEDBACK_CHANNEL_ID)
    client.channels.fetch.mockResolvedValue(mockChannel as any)

    await useCase.execute(client)

    expect(mockChannel.messages.fetch).toHaveBeenCalledWith({ limit: 1 })
    expect(logger.info).toHaveBeenCalledWith(`Feedback message already exists in channel ${FEEDBACK_CHANNEL_ID}.`)
    expect(mockChannel.send).not.toHaveBeenCalled()
  })

  it("should send a new feedback message if the channel is empty", async () => {
    // const mockChannel = {
    //   isTextBased: () => true,
    //   isSendable: () => true,
    //   messages: {
    //     fetch: jest.fn().mockResolvedValue(new Collection()),
    //   },
    //   send: jest.fn(),
    // }
    const mockChannel = mockDeep<TextChannel>()
    mockChannel.isTextBased.mockReturnValue(true)
    mockChannel.isSendable.mockReturnValue(true)
    mockChannel.messages.fetch.mockResolvedValue(new Collection())

    secretManager.getOrThrow.mockResolvedValue(FEEDBACK_CHANNEL_ID)

    client.channels.fetch.mockResolvedValue(mockChannel)

    await useCase.execute(client)

    expect(mockChannel.messages.fetch).toHaveBeenCalledWith({ limit: 1 })
    expect(mockChannel.send).toHaveBeenCalledTimes(1)
    const sentMessage = mockChannel.send.mock.calls[0][0] as MessagePayloadOption

    expect(sentMessage.embeds).toHaveLength(1)
  })

  it("should propagate error if secret manager fails", async () => {
    const error = new Error("Failed to get secret")
    secretManager.getOrThrow.mockRejectedValue(error)

    await expect(useCase.execute(client)).rejects.toThrow(error)

    expect(client.channels.fetch).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })
})
