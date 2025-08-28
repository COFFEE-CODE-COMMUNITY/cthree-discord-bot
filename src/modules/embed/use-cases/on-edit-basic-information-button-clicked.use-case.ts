import { Injectable } from "@nestjs/common"
import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"

@Injectable()
export class OnEditBasicInformationButtonClickedUseCase {
  public constructor(private readonly embedRepository: EmbedRepository) {}

  public async execute(interaction: ButtonInteraction, embedId: string): Promise<void> {
    // Check if interaction is already acknowledged
    const embed = await this.embedRepository.findById(embedId)
    const titleInput = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.title || "")
      .setRequired(true)

    const descriptionInput = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(embed?.description || "")
      .setRequired(false)

    const colorInput = new TextInputBuilder()
      .setCustomId("color")
      .setLabel("Color (Hex Code)")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.hexColor || "")
      .setRequired(false)

    const titleActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput)
    const descriptionActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput)
    const colorActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput)

    const modal = new ModalBuilder()
      .setCustomId(`basic-information-modal/${embedId}/${interaction.message.id}`)
      .setTitle("Edit Basic Information")
      .addComponents(titleActionRow, descriptionActionRow, colorActionRow)

    await interaction.showModal(modal)
  }
}
