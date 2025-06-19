import { Injectable } from "@nestjs/common"
import { Context, On, ContextOf } from "necord"
import { Message } from "discord.js"
import { HandleBoosterMessageUseCase } from "../use-cases/handle-booster-message.use-case"

@Injectable()
export class BoosterEvent {
  public constructor(private readonly handleBoosterMessageUseCase: HandleBoosterMessageUseCase) {}

  @On("messageCreate")
  public async onMessageCreate(@Context() [message]: ContextOf<"messageCreate">): Promise<void> {
    await this.handleBoosterMessageUseCase.execute(message as Message<true>)
  }
}
