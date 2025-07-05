import { Inject, Injectable } from "@nestjs/common"
import { ChatInputCommandInteraction } from "discord.js"
import { DisableStickyMessageDto } from "../dtos/disable-sticky-message.dto"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class DisableStickyMessageUseCase {
  public constructor(
    @Inject(STICKY_MESSAGE_REPOSITORY) private readonly stickyMessageRepository: StickyMessageRepository,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction, options: DisableStickyMessageDto): Promise<void> {
    const channelId = options.channel || interaction.channelId

    try {
      await this.stickyMessageRepository.deleteByChannelId(channelId)

      await interaction.reply({
        content: `Sticky message has been disabled for <#${channelId}>.`,
        flags: "Ephemeral",
      })
    } catch (error) {
      this.logger.error(`Failed to disable sticky message for channel ${channelId}`, error)

      await interaction.reply({
        content: `Failed to disable sticky message for <#${channelId}>. Please try again later.`,
        flags: "Ephemeral",
      })
    }
  }
}
