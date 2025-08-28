import { ChatInputCommandInteraction } from "discord.js"
import { DisableAutoDeleteMessageDto } from "../dtos/disable-auto-delete-message.dto"
import { AutoDeleteMessageRepository } from "../repositories/auto-delete-message.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class DisableAutoDeleteMessageUseCase {
  public constructor(private readonly autoDeleteMessageRepository: AutoDeleteMessageRepository) {}

  public async execute(interaction: ChatInputCommandInteraction, options: DisableAutoDeleteMessageDto): Promise<void> {
    const channelId = options.channel?.id || interaction.channelId

    if (!channelId) {
      await interaction.reply({
        content: "Invalid channel id.",
        flags: "Ephemeral",
      })
      return
    }

    await this.autoDeleteMessageRepository.deleteByChannelId(channelId)

    await interaction.reply({
      content: `Auto delete message disabled for <#${channelId}>`,
      flags: "Ephemeral",
    })
  }
}
