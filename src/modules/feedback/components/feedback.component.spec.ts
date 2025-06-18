import { Test } from "@nestjs/testing"
import { mock, MockProxy } from "jest-mock-extended"
import { ButtonInteraction, ModalSubmitInteraction } from "discord.js"
import { ButtonContext, ModalContext } from "necord"
import { FeedbackComponent } from "./feedback.component"
import { ShowFeedbackModalUseCase } from "../use-cases/show-feedback-modal.use-case"
import { SubmitFeedbackUseCase } from "../use-cases/submit-feedback.use-case"

describe("FeedbackComponent", () => {
  let component: FeedbackComponent
  let showFeedbackModalUseCase: MockProxy<ShowFeedbackModalUseCase>
  let submitFeedbackUseCase: MockProxy<SubmitFeedbackUseCase>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackComponent,
        {
          provide: ShowFeedbackModalUseCase,
          useValue: mock<ShowFeedbackModalUseCase>(),
        },
        {
          provide: SubmitFeedbackUseCase,
          useValue: mock<SubmitFeedbackUseCase>(),
        },
      ],
    }).compile()

    component = module.get(FeedbackComponent)
    showFeedbackModalUseCase = module.get(ShowFeedbackModalUseCase)
    submitFeedbackUseCase = module.get(SubmitFeedbackUseCase)
  })

  describe("sendFeedbackButton", () => {
    it("should call the show feedback modal use case with the interaction", async () => {
      const mockInteraction = mock<ButtonInteraction>()
      const context = [mockInteraction] as ButtonContext

      await component.sendFeedbackButton(context)

      expect(showFeedbackModalUseCase.execute).toHaveBeenCalledWith(mockInteraction)
      expect(showFeedbackModalUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should propagate errors from the use case", async () => {
      const error = new Error("Test Error")
      showFeedbackModalUseCase.execute.mockRejectedValue(error)
      const mockInteraction = mock<ButtonInteraction>()
      const context = [mockInteraction] as ButtonContext

      await expect(component.sendFeedbackButton(context)).rejects.toThrow(error)
    })
  })

  describe("feedbackModalSubmit", () => {
    it("should call the submit feedback use case with the interaction", async () => {
      const mockInteraction = mock<ModalSubmitInteraction>()
      const context = [mockInteraction] as ModalContext

      await component.feedbackModalSubmit(context)

      expect(submitFeedbackUseCase.execute).toHaveBeenCalledWith(mockInteraction)
      expect(submitFeedbackUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it("should propagate errors from the use case", async () => {
      const error = new Error("Test Error")
      submitFeedbackUseCase.execute.mockRejectedValue(error)
      const mockInteraction = mock<ModalSubmitInteraction>()
      const context = [mockInteraction] as ModalContext

      await expect(component.feedbackModalSubmit(context)).rejects.toThrow(error)
    })
  })
})
