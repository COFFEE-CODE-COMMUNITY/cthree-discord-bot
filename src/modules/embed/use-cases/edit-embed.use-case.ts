import { Injectable } from "@nestjs/common"
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction } from "discord.js"
import { EditEmbedDto } from "../dtos/edit-embed.dto"
import { EmbedRepository } from "../repositories/embed.repository"
import { EmbedService } from "../services/embed.service"

@Injectable()
export class EditEmbedUseCase {
  public constructor(
    private readonly embedService: EmbedService,
    private readonly embedRepository: EmbedRepository,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction, dto: EditEmbedDto): Promise<void> {
    const embed = await this.embedRepository.findByNameAndGuildId(dto.name, interaction.guildId || "")

    if (!embed) {
      await interaction.reply({
        content: `No embed found with the name "${dto.name}". Please check the name and try again.`,
        flags: "Ephemeral",
      })

      return
    }

    const embedPreview = this.embedService.getEmbedViewer(embed)
    const embedButtons = this.embedService.getEmbedButtonsEditor(embed)
    const rowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(embedButtons)

    await interaction.reply({
      embeds: [embedPreview],
      components: [rowButtons],
    })
  }
}
