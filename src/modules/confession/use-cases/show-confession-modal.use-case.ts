import { Injectable } from "@nestjs/common"
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonInteraction } from "discord.js"

import { CREATE_CONFESSION_MODAL } from "../constants/custom-id.constant"

@Injectable()
export class ShowConfessionModalUseCase {
  public async execute(interaction: ButtonInteraction): Promise<void> {
    const bodyInput = new TextInputBuilder()
      .setCustomId("body")
      .setLabel("What do you want to confess?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)

    const imageUrlInput = new TextInputBuilder()
      .setCustomId("imageUrl")
      .setLabel("Image URL (optional)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)

    const modal = new ModalBuilder()
      .setCustomId(CREATE_CONFESSION_MODAL)
      .setTitle("Anonymous Confession")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(bodyInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(imageUrlInput),
      )

    await interaction.showModal(modal)
  }
}
