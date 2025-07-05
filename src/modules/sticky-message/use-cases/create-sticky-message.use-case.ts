import { Inject, Injectable } from "@nestjs/common"
import { Client, ModalSubmitInteraction, ChannelType } from "discord.js"
import { STICKY_MESSAGE_CREATE } from "../constants/custom-id.constants"
import { STICKY_MESSAGE_SERVICE, StickyMessageService } from "../services/sticky-message.service"
import { STICKY_MESSAGE_REPOSITORY, StickyMessageRepository } from "../repositories/sticky-message.repository"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { StickyMessage } from "../entities/sticky-message.entity"

@Injectable()
export class CreateStickyMessageUseCase {
  public constructor(
    @Inject(STICKY_MESSAGE_SERVICE) private readonly stickyMessageService: StickyMessageService,
    @Inject(STICKY_MESSAGE_REPOSITORY) private readonly stickyMessageRepository: StickyMessageRepository,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly discordClient: Client,
  ) {}

  public async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const message = interaction.fields.getTextInputValue(STICKY_MESSAGE_CREATE.input.message)
    const guildId = interaction.guildId
    const userId = interaction.user.id
    const channelId = this.stickyMessageService.getTemporaryUser(userId)?.channelId

    if (!guildId) {
      this.logger.error(`Guild ID not found for user ${userId}.`)
      await interaction.reply({
        content: "You must be in a server to create a sticky message.",
        flags: "Ephemeral",
      })

      return
    }

    if (!channelId) {
      this.logger.error(`Channel ID not found for user ${userId} in guild ${guildId}.`)
      await interaction.reply({
        content: "You must select a channel before creating a sticky message.",
        flags: "Ephemeral",
      })

      return
    }

    const targetChannel = await this.discordClient.channels.fetch(channelId)

    if (targetChannel?.type === ChannelType.GuildText) {
      const { id: messageId } = await targetChannel.send(message)

      try {
        const stickyMessage = new StickyMessage()
        stickyMessage.message = message
        stickyMessage.messageId = messageId
        stickyMessage.guildId = guildId
        stickyMessage.channelId = channelId

        await this.stickyMessageRepository.create(stickyMessage)

        this.stickyMessageService.deleteTemporaryUser(userId)

        await interaction.reply({
          content: "Sticky message created successfully!",
          flags: "Ephemeral",
        })
      } catch (error) {
        this.logger.error(`Failed to create sticky message for user ${userId} in guild ${guildId}:`, error)

        await interaction.reply({
          content: "An error occurred while creating the sticky message. Please try again later.",
          flags: "Ephemeral",
        })
      }
    } else {
      await interaction.reply({
        content: "Channel type is not guild text.",
        flags: "Ephemeral",
      })
    }
  }
}
