import { Module } from "@nestjs/common"
import { FeedbackEvent } from "./events/feedback.event"
import { FeedbackComponent } from "./components/feedback.component"
import { SetupFeedbackMessageUseCase } from "./use-cases/setup-feedback-message.use-case"
import { ShowFeedbackModalUseCase } from "./use-cases/show-feedback-modal.use-case"
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback.use-case"

@Module({
  providers: [
    // Events
    FeedbackEvent,

    // Components
    FeedbackComponent,

    // Use Cases
    SetupFeedbackMessageUseCase,
    ShowFeedbackModalUseCase,
    SubmitFeedbackUseCase,
  ],
})
export class FeedbackModule {}
