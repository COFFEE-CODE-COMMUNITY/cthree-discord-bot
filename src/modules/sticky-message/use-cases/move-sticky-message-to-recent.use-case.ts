import { Inject, Injectable } from "@nestjs/common"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { Message, OmitPartialGroupDMChannel } from "discord.js"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class MoveStickyMessageToRecentUseCase {
  public constructor(
    @Inject(STICKY_MESSAGE_REPOSITORY) private readonly stickyMessageRepository: StickyMessageRepository,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(interaction: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
    if (interaction.author.bot) return

    try {
      const channelId = interaction.channelId
      const stickyMessage = await this.stickyMessageRepository.findByChannelId(channelId)

      if (stickyMessage) {
        const message = await interaction.channel.messages.fetch(stickyMessage.messageId)
        await message.delete()

        const { id: messageId } = await interaction.channel.send(stickyMessage.message)
        stickyMessage.messageId = messageId

        await this.stickyMessageRepository.updateByChannelId(channelId, stickyMessage)
      }
    } catch (error) {
      this.logger.error("Error moving sticky message to recent", error)
    }
  }
}
