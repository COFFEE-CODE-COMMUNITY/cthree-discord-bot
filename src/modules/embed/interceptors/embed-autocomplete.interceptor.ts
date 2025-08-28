import { Injectable } from "@nestjs/common"
import { AutocompleteInteraction } from "discord.js"
import { AutocompleteInterceptor } from "necord"
import { EmbedRepository } from "../repositories/embed.repository"
import { Embed } from "../entities/embed.entity"

@Injectable()
export class EmbedAutocompleteInterceptor extends AutocompleteInterceptor {
  public constructor(private readonly embedRepository: EmbedRepository) {
    super()
  }

  public async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true)
    let choices: string[] = []

    if (focused.name === "name") {
      const embeds = await this.embedRepository.findByGuildId(interaction.guildId || "")
      choices = embeds.map((embed: Embed): string => embed.name)
    }

    await interaction.respond(
      choices
        .filter((choice: string): boolean => choice.toLowerCase().startsWith(focused.value.toLowerCase()))
        .slice(0, 25)
        .map((choice: string): { name: string; value: string } => ({ name: choice, value: choice })),
    )
  }
}
