import { ChatInputCommandInteraction } from "discord.js"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { Injectable } from "@nestjs/common"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { AutoDeleteMessage } from "../entities/auto-delete-message.entity"

@Injectable()
export class EnableAutoDeleteMessageUseCase {
  public constructor(private readonly autoDeleteMessageRepository: AutoDeleteMessageRepository) {}

  public async execute(interaction: ChatInputCommandInteraction, options: EnableAutoDeleteMessageDto): Promise<void> {
    const guildId = interaction.guildId
    const channelId = options.channel?.id || interaction.channelId

    if (!channelId || !guildId) {
      await interaction.reply({
        content: "Invalid channel or guild ID.",
        flags: "Ephemeral",
      })
      return
    }

    const isExists = await this.autoDeleteMessageRepository.existsByChannelId(channelId)

    if (isExists) {
      await interaction.reply({
        content: "Auto-delete messages is already enabled for this channel.",
        flags: "Ephemeral",
      })
      return
    } else {
      const autoDeleteMessage = new AutoDeleteMessage()
      autoDeleteMessage.guildId = guildId
      autoDeleteMessage.channelId = channelId

      await this.autoDeleteMessageRepository.insert(autoDeleteMessage)

      await interaction.reply({
        content: `Auto delete message enabled for <#${channelId}>`,
        flags: "Ephemeral",
      })
      return
    }
  }
}
