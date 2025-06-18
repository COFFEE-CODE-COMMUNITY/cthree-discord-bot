import { Inject, Injectable } from "@nestjs/common"
import { Context, ContextOf, Once } from "necord"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js"
import { FEEDBACK_SEND_BUTTON } from "../constants/custom-id.constants"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"

@Injectable()
export class FeedbackEvent {
  public constructor(
    private readonly secret: SecretManager,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  @Once("ready")
  public async onReady(@Context() [client]: ContextOf<"ready">): Promise<void> {
    const feedbackChannelId = await this.secret.getOrThrow("C3_FEEDBACK_CHANNEL_ID")
    const feedbackChannel = await client.channels.fetch(feedbackChannelId)

    if (!feedbackChannel) {
      this.logger.error(`Feedback channel with ID ${feedbackChannelId} not found.`)
      return
    }

    if (!feedbackChannel.isTextBased()) {
      this.logger.error(`Feedback channel with ID ${feedbackChannelId} is not a text channel.`)
      return
    }

    if (!feedbackChannel.isSendable()) {
      this.logger.error(`Feedback channel with ID ${feedbackChannelId} is not sendable.`)
      return
    }

    const feedbackChannelMessages = await feedbackChannel.messages.fetch({ limit: 1 })

    if (feedbackChannelMessages.size === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Feedback")
        .setDescription(
          "Silakan berikan kritik dan saran Anda untuk membantu kami meningkatkan server ini. Masukan Anda hanya akan terlihat oleh admin.",
        )
        .setColor("#37cee6")

      const sendFeedbackButton = new ButtonBuilder()
        .setCustomId(FEEDBACK_SEND_BUTTON)
        .setLabel("Send Feedback")
        .setStyle(ButtonStyle.Primary)

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(sendFeedbackButton)

      await feedbackChannel.send({
        embeds: [embed],
        components: [row],
      })
    }
  }
}
