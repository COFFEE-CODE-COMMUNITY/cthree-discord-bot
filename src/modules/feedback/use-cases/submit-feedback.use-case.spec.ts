import { DeepMockProxy, mock, mockDeep, MockProxy } from "jest-mock-extended"
import { ModalSubmitInteraction, TextChannel, EmbedBuilder } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger } from "../../../common/interfaces/logger/logger.interface"
import { SubmitFeedbackUseCase } from "./submit-feedback.use-case"

describe("SubmitFeedbackUseCase", () => {
  let useCase: SubmitFeedbackUseCase
  let secretManager: MockProxy<SecretManager>
  let logger: MockProxy<Logger>
  let mockInteraction: DeepMockProxy<ModalSubmitInteraction>
  let mockLogChannel: MockProxy<TextChannel>

  const LOG_FEEDBACK_CHANNEL_ID = "log-feedback-channel-id"
  const TOPIC = "Test Topic"
  const MESSAGE = "This is a test message."

  beforeEach(() => {
    secretManager = mock<SecretManager>()
    logger = mock<Logger>()
    mockInteraction = mockDeep<ModalSubmitInteraction>()
    mockLogChannel = mock<TextChannel>()

    useCase = new SubmitFeedbackUseCase(secretManager, logger)

    mockInteraction.fields.getTextInputValue.calledWith("topic").mockReturnValue(TOPIC)
    mockInteraction.fields.getTextInputValue.calledWith("message").mockReturnValue(MESSAGE)

    secretManager.getOrThrow.mockResolvedValue(LOG_FEEDBACK_CHANNEL_ID)

    mockLogChannel.isTextBased.mockReturnValue(true)
    mockLogChannel.isSendable.mockReturnValue(true)
    ;(mockInteraction.client.channels.fetch as jest.Mock).mockResolvedValue(mockLogChannel)
  })

  it("should submit feedback, send it to the log channel, and reply with success", async () => {
    await useCase.execute(mockInteraction)

    expect(secretManager.getOrThrow).toHaveBeenCalledWith("C3_LOG_FEEDBACK_CHANNEL_ID")
    expect(mockInteraction.client.channels.fetch).toHaveBeenCalledWith(LOG_FEEDBACK_CHANNEL_ID)
    expect(mockLogChannel.send).toHaveBeenCalledTimes(1)

    const sentPayload = mockLogChannel.send.mock.calls[0][0] as { embeds: EmbedBuilder[] }
    expect(sentPayload.embeds).toHaveLength(1)
    const embedData = sentPayload.embeds[0].toJSON()
    expect(embedData.title).toBe("Feedback")
    expect(embedData.fields).toContainEqual({ name: "Topic", value: TOPIC, inline: false })
    expect(embedData.fields).toContainEqual({ name: "Message", value: MESSAGE, inline: false })

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "Terima kasih atas feedback Anda!",
      flags: "Ephemeral",
    })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("should reply with an error if the log channel is not found", async () => {
    ;(mockInteraction.client.channels.fetch as jest.Mock).mockResolvedValue(null)

    await useCase.execute(mockInteraction)

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "Feedback channel is not available. Please try again later.",
      flags: "Ephemeral",
    })
    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${LOG_FEEDBACK_CHANNEL_ID} is not available.`)
    expect(mockLogChannel.send).not.toHaveBeenCalled()
  })

  it("should reply with an error if the log channel is not text-based", async () => {
    mockLogChannel.isTextBased.mockReturnValue(false)

    await useCase.execute(mockInteraction)

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "Feedback channel is not available. Please try again later.",
      flags: "Ephemeral",
    })
    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${LOG_FEEDBACK_CHANNEL_ID} is not available.`)
    expect(mockLogChannel.send).not.toHaveBeenCalled()
  })

  it("should reply with an error if the log channel is not sendable", async () => {
    mockLogChannel.isSendable.mockReturnValue(false)

    await useCase.execute(mockInteraction)

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: "Feedback channel is not available. Please try again later.",
      flags: "Ephemeral",
    })
    expect(logger.error).toHaveBeenCalledWith(`Feedback channel with ID ${LOG_FEEDBACK_CHANNEL_ID} is not available.`)
    expect(mockLogChannel.send).not.toHaveBeenCalled()
  })

  it("should propagate an error if the secret manager fails", async () => {
    const error = new Error("Secret manager error")
    secretManager.getOrThrow.mockRejectedValue(error)

    await expect(useCase.execute(mockInteraction)).rejects.toThrow(error)

    expect(mockInteraction.reply).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockLogChannel.send).not.toHaveBeenCalled()
  })
})
