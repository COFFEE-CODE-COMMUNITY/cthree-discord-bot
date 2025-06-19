import { Injectable } from "@nestjs/common"
import { Button, ButtonContext, Context, Modal, ModalContext } from "necord"
import { FEEDBACK_SEND_BUTTON, FEEDBACK_MODAL_SUBMIT } from "../constants/custom-id.constants"
import { ShowFeedbackModalUseCase } from "../use-cases/show-feedback-modal.use-case"
import { SubmitFeedbackUseCase } from "../use-cases/submit-feedback.use-case"

@Injectable()
export class FeedbackComponent {
  public constructor(
    private readonly showFeedbackModalUseCase: ShowFeedbackModalUseCase,
    private readonly submitFeedbackUseCase: SubmitFeedbackUseCase,
  ) {}

  @Button(FEEDBACK_SEND_BUTTON)
  public async sendFeedbackButton(@Context() [interaction]: ButtonContext): Promise<void> {
    await this.showFeedbackModalUseCase.execute(interaction)
  }

  @Modal(FEEDBACK_MODAL_SUBMIT)
  public async feedbackModalSubmit(@Context() [interaction]: ModalContext): Promise<void> {
    await this.submitFeedbackUseCase.execute(interaction)
  }
}
