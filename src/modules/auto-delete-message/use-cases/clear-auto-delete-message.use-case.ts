import { Injectable } from "@nestjs/common"
import { ChatInputCommandInteraction } from "discord.js"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"

@Injectable()
export class ClearAutoDeleteMessageUseCase {
  public constructor(private readonly autoDeleteMessageRepository: AutoDeleteMessageRepository) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        flags: "Ephemeral",
      })

      return
    }

    await this.autoDeleteMessageRepository.deleteByGuildId(interaction.guildId)

    await interaction.reply({
      content: "Auto-delete message has cleared on this guild.",
      flags: "Ephemeral",
    })
  }
}
