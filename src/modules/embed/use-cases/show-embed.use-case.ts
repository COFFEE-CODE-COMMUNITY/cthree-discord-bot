import { Injectable } from "@nestjs/common"
import { ChatInputCommandInteraction } from "discord.js"
import { EmbedService } from "../services/embed.service"
import { EmbedRepository } from "../repositories/embed.repository"
import { ShowEmbedDto } from "../dtos/show-embed.dto"

@Injectable()
export class ShowEmbedUseCase {
  public constructor(
    private readonly embedService: EmbedService,
    private readonly embedRepository: EmbedRepository,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction, options: ShowEmbedDto): Promise<void> {
    const embed = await this.embedRepository.findByNameAndGuildId(options.name, interaction.guildId || "")

    if (!embed) {
      await interaction.reply({
        content: `No embed found with the name "${options.name}". Please check the name and try again.`,
        flags: "Ephemeral",
      })
      return
    }

    const embedPreview = this.embedService.getEmbedViewer(embed)

    await interaction.reply({
      embeds: [embedPreview],
    })
  }
}
