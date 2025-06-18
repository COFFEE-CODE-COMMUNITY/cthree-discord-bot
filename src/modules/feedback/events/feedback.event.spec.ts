import { Test } from "@nestjs/testing"
import { mock, MockProxy } from "jest-mock-extended"
import { Client } from "discord.js"
import { ContextOf } from "necord"
import { FeedbackEvent } from "./feedback.event"
import { SetupFeedbackMessageUseCase } from "../use-cases/setup-feedback-message.use-case"

describe("FeedbackEvent", () => {
  let event: FeedbackEvent
  let setupFeedbackMessageUseCase: MockProxy<SetupFeedbackMessageUseCase>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackEvent,
        {
          provide: SetupFeedbackMessageUseCase,
          useValue: mock<SetupFeedbackMessageUseCase>(),
        },
      ],
    }).compile()

    event = module.get(FeedbackEvent)
    setupFeedbackMessageUseCase = module.get(SetupFeedbackMessageUseCase)
  })

  describe("onReady", () => {
    it("should call the setup feedback message use case with the client", async () => {
      const mockClient = mock<Client>()
      const context = [mockClient] as ContextOf<"ready">

      await event.onReady(context)

      expect(setupFeedbackMessageUseCase.execute).toHaveBeenCalledWith(mockClient)
      expect(setupFeedbackMessageUseCase.execute).toHaveBeenCalledTimes(1)
    })
  })
})
