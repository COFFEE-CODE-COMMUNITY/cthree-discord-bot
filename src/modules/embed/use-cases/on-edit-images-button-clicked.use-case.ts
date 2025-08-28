import { Injectable } from "@nestjs/common"
import { ActionRowBuilder, ButtonInteraction, TextInputBuilder, TextInputStyle, ModalBuilder } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"

@Injectable()
export class OnEditImagesButtonClickedUseCase {
  public constructor(private readonly embedRepository: EmbedRepository) {}

  public async execute(interaction: ButtonInteraction, embedId: string): Promise<void> {
    const embed = await this.embedRepository.findById(embedId)
    const mainImageUrlInput = new TextInputBuilder()
      .setCustomId("mainImageUrl")
      .setLabel("Main Image URL")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.mainImageUrl || "")
      .setRequired(false)

    const thumbnailImageUrlInput = new TextInputBuilder()
      .setCustomId("thumbnailImageUrl")
      .setLabel("Thumbnail Image URL")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.thumbnailImageUrl || "")
      .setRequired(false)

    const mainImageUrlActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(mainImageUrlInput)
    const thumbnailImageUrlActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(thumbnailImageUrlInput)

    const modal = new ModalBuilder()
      .setCustomId(`images-modal/${embedId}/${interaction.message.id}`)
      .setTitle("Edit Images")
      .addComponents(mainImageUrlActionRow, thumbnailImageUrlActionRow)

    await interaction.showModal(modal)
  }
}
