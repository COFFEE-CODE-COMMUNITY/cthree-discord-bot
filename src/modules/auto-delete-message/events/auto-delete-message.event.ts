import { Injectable } from "@nestjs/common"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { Context, ContextOf, On } from "necord"

@Injectable()
export class AutoDeleteMessageEvent {
  public constructor(private readonly autoDeleteMessageRepostiory: AutoDeleteMessageRepository) {}

  @On("messageCreate")
  public async onMessageCreate(@Context() [message]: ContextOf<"messageCreate">): Promise<void> {
    if (message.author.bot) return

    const channelId = message.channelId
    const isExists = await this.autoDeleteMessageRepostiory.existsByChannelId(channelId)

    if (isExists) {
      await message.delete()
    }
  }
}
