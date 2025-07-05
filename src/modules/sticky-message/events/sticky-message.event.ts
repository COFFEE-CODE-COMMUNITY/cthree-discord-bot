import { Injectable } from "@nestjs/common"
import { Context, ContextOf, On } from "necord"
import { MoveStickyMessageToRecentUseCase } from "../use-cases/move-sticky-message-to-recent.use-case"

@Injectable()
export class StickyMessageEvent {
  public constructor(private readonly moveStickyMessageToRecentUseCase: MoveStickyMessageToRecentUseCase) {}

  @On("messageCreate")
  public async onMessageCreate(@Context() [message]: ContextOf<"messageCreate">): Promise<void> {
    await this.moveStickyMessageToRecentUseCase.execute(message)
  }
}
