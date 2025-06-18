import { Injectable, Inject } from "@nestjs/common"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { ModalSubmitInteraction, EmbedBuilder } from "discord.js"

@Injectable()
export class SubmitFeedbackUseCase {
  public constructor(
    private readonly secret: SecretManager,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(modal: ModalSubmitInteraction): Promise<void> {
    const topic = modal.fields.getTextInputValue("topic")
    const message = modal.fields.getTextInputValue("message")
    const logFeedbackChannelId = await this.secret.getOrThrow("C3_LOG_FEEDBACK_CHANNEL_ID")
    const logFeedbackChannel = await modal.client.channels.fetch(logFeedbackChannelId)

    if (!logFeedbackChannel || !logFeedbackChannel.isTextBased() || !logFeedbackChannel.isSendable()) {
      await modal.reply({
        content: "Feedback channel is not available. Please try again later.",
        flags: "Ephemeral",
      })

      this.logger.error(`Feedback channel with ID ${logFeedbackChannelId} is not available.`)
      return
    }

    const embed = new EmbedBuilder()
      .setTitle("Feedback")
      .addFields({ name: "Topic", value: topic, inline: false }, { name: "Message", value: message, inline: false })
      .setTimestamp(new Date())
      .setColor("#37cee6")

    await logFeedbackChannel.send({
      embeds: [embed],
    })

    await modal.reply({
      content: "Terima kasih atas feedback Anda!",
      flags: "Ephemeral",
    })
  }
}
