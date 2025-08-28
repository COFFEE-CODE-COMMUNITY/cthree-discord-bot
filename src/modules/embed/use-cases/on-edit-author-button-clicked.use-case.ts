import { Injectable } from "@nestjs/common"
import { ButtonInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"

@Injectable()
export class OnEditAuthorButtonClickedUseCase {
  public constructor(private readonly embedRepository: EmbedRepository) {}

  public async execute(interaction: ButtonInteraction, embedId: string): Promise<void> {
    const embed = await this.embedRepository.findById(embedId)
    const authorInput = new TextInputBuilder()
      .setCustomId("author")
      .setLabel("Author")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.author || "")
      .setRequired(false)

    const authorIconUrlInput = new TextInputBuilder()
      .setCustomId("authorIconUrl")
      .setLabel("Author Icon URL")
      .setStyle(TextInputStyle.Short)
      .setValue(embed?.authorIconUrl || "")
      .setRequired(false)

    const authorActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(authorInput)
    const authorIconUrlActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(authorIconUrlInput)

    const modal = new ModalBuilder()
      .setCustomId(`author-modal/${embedId}/${interaction.message.id}`)
      .setTitle("Edit Author")
      .addComponents(authorActionRow, authorIconUrlActionRow)

    await interaction.showModal(modal)
  }
}
