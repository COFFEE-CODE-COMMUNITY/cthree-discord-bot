import { Inject, Injectable } from "@nestjs/common"
import { Button, ButtonContext, Context, Modal, ModalContext } from "necord"
import { FEEDBACK_SEND_BUTTON, FEEDBACK_MODAL_SUBMIT } from "../constants/custom-id.constants"
import { EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class FeedbackComponent {
  public constructor(
    private readonly secret: SecretManager,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  @Button(FEEDBACK_SEND_BUTTON)
  public async sendFeedbackButton(@Context() [interaction]: ButtonContext): Promise<void> {
    const topicInput = new TextInputBuilder()
      .setCustomId("topic")
      .setLabel("Topic")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(256)

    const messageInput = new TextInputBuilder()
      .setCustomId("message")
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1024)

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(topicInput)
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput)

    const feedbackModal = new ModalBuilder()
      .setCustomId(FEEDBACK_MODAL_SUBMIT)
      .setTitle("Send Feedback")
      .addComponents(firstActionRow, secondActionRow)

    await interaction.showModal(feedbackModal)
  }

  @Modal(FEEDBACK_MODAL_SUBMIT)
  public async feedbackModalSubmit(@Context() [interaction]: ModalContext): Promise<void> {
    const topic = interaction.fields.getTextInputValue("topic")
    const message = interaction.fields.getTextInputValue("message")
    const logFeedbackChannelId = await this.secret.getOrThrow("C3_LOG_FEEDBACK_CHANNEL_ID")
    const logFeedbackChannel = await interaction.client.channels.fetch(logFeedbackChannelId)

    if (!logFeedbackChannel || !logFeedbackChannel.isTextBased() || !logFeedbackChannel.isSendable()) {
      await interaction.reply({
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

    await interaction.reply({
      content: "Terima kasih atas feedback Anda!",
      flags: "Ephemeral",
    })
  }
}
