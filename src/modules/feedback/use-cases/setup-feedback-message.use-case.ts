import { Inject, Injectable } from "@nestjs/common"
import { Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { FEEDBACK_SEND_BUTTON } from "../constants/custom-id.constants"

@Injectable()
export class SetupFeedbackMessageUseCase {
  public constructor(
    private readonly secret: SecretManager,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(client: Client): Promise<void> {
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
    } else {
      this.logger.info(`Feedback message already exists in channel ${feedbackChannelId}.`)
    }
  }
}
