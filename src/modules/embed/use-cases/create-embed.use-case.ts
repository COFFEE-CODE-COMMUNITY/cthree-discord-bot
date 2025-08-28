import { Injectable } from "@nestjs/common"
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction } from "discord.js"
import { CreateEmbedDto } from "../dtos/create-embed.dto"
import { EmbedRepository } from "../repositories/embed.repository"
import { Embed } from "../entities/embed.entity"
import { EmbedService } from "../services/embed.service"

@Injectable()
export class CreateEmbedUseCase {
  public constructor(
    private readonly embedRepository: EmbedRepository,
    private readonly embedService: EmbedService,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction, dto: CreateEmbedDto): Promise<void> {
    const isEmbedNameExists = await this.embedRepository.existsByNameAndGuildId(dto.name, interaction.guildId || "")

    if (isEmbedNameExists) {
      await interaction.reply({
        content: `An embed with the name "${dto.name}" already exists. Please choose a different name.`,
        flags: "Ephemeral",
      })

      return
    }

    const embed = new Embed()
    embed.name = dto.name
    embed.guildId = interaction.guildId!
    embed.title = dto.name

    const savedEmbed = await this.embedRepository.save(embed)
    const embedPreview = this.embedService.getEmbedViewer(savedEmbed)
    const embedButtons = this.embedService.getEmbedButtonsEditor(savedEmbed)
    const rowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(embedButtons)

    await interaction.reply({
      embeds: [embedPreview],
      components: [rowButtons],
      withResponse: true,
    })
  }
}
