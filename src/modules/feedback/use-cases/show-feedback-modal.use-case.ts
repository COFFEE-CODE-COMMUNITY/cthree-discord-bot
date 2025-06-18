import { Injectable } from "@nestjs/common"
import { ButtonInteraction, TextInputBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle } from "discord.js"
import { FEEDBACK_MODAL_SUBMIT } from "../constants/custom-id.constants"

@Injectable()
export class ShowFeedbackModalUseCase {
  public async execute(button: ButtonInteraction): Promise<void> {
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

    await button.showModal(feedbackModal)
  }
}
