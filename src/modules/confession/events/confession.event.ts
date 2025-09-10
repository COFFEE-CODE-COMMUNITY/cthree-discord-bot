import { Injectable } from "@nestjs/common"
import { On } from "necord"
import { Message } from "discord.js"
import { ReplyConfessionThreadUseCase } from "../use-cases/reply-confession-thread.use-case"

@Injectable()
export class ConfessionEvent {
  public constructor(private readonly replyConfessionThreadUseCase: ReplyConfessionThreadUseCase) {}

  @On("messageCreate")
  public async onMessageCreate(message: Message): Promise<void> {
    // Hanya jalankan untuk message dari user
    if (message.author.bot) return

    // Hanya jalankan jika di thread
    if (!message.channel.isThread()) return

    await this.replyConfessionThreadUseCase.execute(message)
  }
}
