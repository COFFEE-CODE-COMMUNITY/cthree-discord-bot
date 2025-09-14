import { Inject, Injectable } from "@nestjs/common"
import { ButtonContext, Context, On } from "necord"
import { Message } from "discord.js"
import { ReplyConfessionThreadUseCase } from "../use-cases/reply-confession-thread.use-case"
import { CREATE_CONFESSION_BTN, REPLY_CONFESSION_BTN } from "../constants/custom-id.constant"
import { CreateConfessionThreadUseCase } from "../use-cases/create-confession-thread.use-case"
import { ShowConfessionModalUseCase } from "../use-cases/show-confession-modal.use-case"
import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"

@Injectable()
export class ConfessionEvent {
  public constructor(
    private readonly createConfessionThreadUseCase: CreateConfessionThreadUseCase,
    private readonly replyConfessionThreadUseCase: ReplyConfessionThreadUseCase,
    private readonly showConfessionModalUseCase: ShowConfessionModalUseCase,
    @Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService,
  ) {}

  @On("messageCreate")
  public async onMessageCreate(@Context() [message]: [Message]): Promise<void> {
    if (message.author.bot || message.webhookId) return
    if (!message.channel.isThread()) return

    const thread = message.channel
    const parentChannelId = thread.parentId
    const guildId = message.guildId

    if (!guildId || !parentChannelId) return

    const confessionConfig = await this.confessionService.getConfessionChannel(guildId)

    if (!confessionConfig?.isActive) return
    if (confessionConfig.channelId !== parentChannelId) return

    await this.replyConfessionThreadUseCase.execute(message)
  }

  @On("interactionCreate")
  public async onInteraction(@Context() [interaction]: ButtonContext): Promise<void> {
    const { customId } = interaction

    if (customId === CREATE_CONFESSION_BTN) {
      console.log("MAKE confession button clicked")
      await this.showConfessionModalUseCase.execute(interaction)
    }

    if (customId === REPLY_CONFESSION_BTN) {
      console.log("REPLY confession button clicked")
      await this.createConfessionThreadUseCase.execute(interaction)
    }
  }
}
