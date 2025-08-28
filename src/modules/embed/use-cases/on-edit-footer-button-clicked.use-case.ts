import { Injectable } from "@nestjs/common"
import { EmbedRepository } from "../repositories/embed.repository"
import { ButtonInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder } from "discord.js"

@Injectable()
export class OnEditFooterButtonClickedUseCase {
  public constructor(private readonly embedRepository: EmbedRepository) {}

  public async execute(interaction: ButtonInteraction, embedId: string): Promise<void> {
    const embed = await this.embedRepository.findById(embedId)

    if (!embed) {
      await interaction.reply({
        content: "Embed not found.",
        flags: "Ephemeral",
      })
      return
    }

    const footerTextInput = new TextInputBuilder()
      .setCustomId("footerText")
      .setLabel("Footer Text")
      .setStyle(TextInputStyle.Short)
      .setValue(embed.footerText || "")
      .setRequired(false)

    const footerImageUrlInput = new TextInputBuilder()
      .setCustomId("footerIconUrl")
      .setLabel("Footer Icon URL")
      .setStyle(TextInputStyle.Short)
      .setValue(embed.footerIconUrl || "")
      .setRequired(false)

    const footerTimestampInput = new TextInputBuilder()
      .setCustomId("footerTimestamp")
      .setLabel("Footer Timestamp (yes/no)")
      .setStyle(TextInputStyle.Short)
      .setValue(embed.footerTimestamp ? "yes" : "no")
      .setRequired(false)

    const footerTextActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(footerTextInput)
    const footerIconUrlActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(footerImageUrlInput)
    const footerTimestampActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(footerTimestampInput)

    const modal = new ModalBuilder()
      .setCustomId(`footer-modal/${embedId}/${interaction.message.id}`)
      .setTitle("Edit Footer")
      .addComponents(footerTextActionRow, footerIconUrlActionRow, footerTimestampActionRow)

    await interaction.showModal(modal)
  }
}
