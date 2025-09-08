import { Injectable } from "@nestjs/common"
import { ButtonContext } from "necord"
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"

@Injectable()
export class ShowConfessionModalUseCase {
  // constructor() {}

  public async execute(interaction: ButtonContext[0]): Promise<void> {
    const modal = new ModalBuilder().setCustomId("confession-modal").setTitle("Anonymous Confession")

    const confessionInput = new TextInputBuilder()
      .setCustomId("confession-content")
      .setLabel("Your Confession")
      .setPlaceholder("Share your story, thoughts, or feelings here...")
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(10)
      .setMaxLength(2000)
      .setRequired(true)

    const titleInput = new TextInputBuilder()
      .setCustomId("confession-title")
      .setLabel("Title (Optional)")
      .setPlaceholder("Give your confession a title...")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setRequired(false)

    const actionRow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput)
    const actionRow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(confessionInput)

    modal.addComponents(actionRow1, actionRow2)

    await interaction.showModal(modal)
  }
}
