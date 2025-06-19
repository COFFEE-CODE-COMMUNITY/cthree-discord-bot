import { mock, MockProxy } from "jest-mock-extended"
import { ButtonInteraction, ModalBuilder, TextInputStyle } from "discord.js"
import { ShowFeedbackModalUseCase } from "./show-feedback-modal.use-case"
import { FEEDBACK_MODAL_SUBMIT } from "../constants/custom-id.constants"

describe("ShowFeedbackModalUseCase", () => {
  let useCase: ShowFeedbackModalUseCase
  let mockInteraction: MockProxy<ButtonInteraction>

  beforeEach(() => {
    useCase = new ShowFeedbackModalUseCase()
    mockInteraction = mock<ButtonInteraction>()
  })

  it("should show a feedback modal when executed", async () => {
    await useCase.execute(mockInteraction)

    expect(mockInteraction.showModal).toHaveBeenCalledTimes(1)

    const modal = mockInteraction.showModal.mock.calls[0][0] as ModalBuilder
    const modalJson = modal.toJSON()

    expect(modalJson.custom_id).toBe(FEEDBACK_MODAL_SUBMIT)
    expect(modalJson.title).toBe("Send Feedback")
    expect(modalJson.components).toHaveLength(2)

    const topicRow = modalJson.components[0]
    const topicInput = topicRow.components[0]
    expect(topicInput.custom_id).toBe("topic")
    expect(topicInput.label).toBe("Topic")
    expect(topicInput.style).toBe(TextInputStyle.Short)
    expect(topicInput.max_length).toBe(256)

    const messageRow = modalJson.components[1]
    const messageInput = messageRow.components[0]
    expect(messageInput.custom_id).toBe("message")
    expect(messageInput.label).toBe("Message")
    expect(messageInput.style).toBe(TextInputStyle.Paragraph)
    expect(messageInput.max_length).toBe(1024)
  })

  it("should propagate an error if showing the modal fails", async () => {
    const error = new Error("Failed to show modal")
    mockInteraction.showModal.mockRejectedValue(error)

    await expect(useCase.execute(mockInteraction)).rejects.toThrow(error)
  })
})
