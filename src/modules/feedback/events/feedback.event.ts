import { Injectable } from "@nestjs/common"
import { Context, ContextOf, Once } from "necord"
import { SetupFeedbackMessageUseCase } from "../use-cases/setup-feedback-message.use-case"

@Injectable()
export class FeedbackEvent {
  public constructor(private readonly setupFeedbackMessageUseCase: SetupFeedbackMessageUseCase) {}

  @Once("ready")
  public async onReady(@Context() [client]: ContextOf<"ready">): Promise<void> {
    this.setupFeedbackMessageUseCase.execute(client)
  }
}
