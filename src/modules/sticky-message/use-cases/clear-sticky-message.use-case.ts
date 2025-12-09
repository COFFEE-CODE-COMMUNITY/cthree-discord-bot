import { Inject, Injectable } from "@nestjs/common"
import { StickyMessageRepository } from "../repositories/sticky-message.repository"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { ChatInputCommandInteraction } from "discord.js"

@Injectable()
export class ClearStickyMessageUseCase {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly stickyMessageRepository: StickyMessageRepository,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guildId

    if (guildId) {
      try {
        await this.stickyMessageRepository.deleteByGuildId(guildId)

        await interaction.reply({
          content: "All sticky messages have been cleared on this server.",
          flags: "Ephemeral",
        })
      } catch (error) {
        this.logger.error("Failed to clear sticky messages", error)

        await interaction.reply({
          content: "An error occurred while trying to clear the sticky messages. Please try again later.",
          flags: "Ephemeral",
        })
      }
    } else {
      this.logger.error("Guild ID is not available in the interaction.")

      await interaction.reply({
        content: "You must be in a server to clear the sticky message.",
        flags: "Ephemeral",
      })
    }
  }
}
