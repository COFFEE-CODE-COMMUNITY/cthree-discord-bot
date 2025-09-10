import { Inject, Injectable } from "@nestjs/common"
import { ChatInputCommandInteraction, ChannelType } from "discord.js"
import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"
import { ConfessionChannelRepository } from "../repositories/confession-channel.repository"

@Injectable()
export class DisableConfessionUseCase {
  public constructor(
    @Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService,
    private readonly confessionChannelRepo: ConfessionChannelRepository,
  ) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guildId
    if (!guildId) {
      await interaction.reply({ content: "Guild ID not found.", ephemeral: true })
      return
    }

    const config = await this.confessionService.getConfessionChannel(guildId)

    if (!config || !config.channelId || !config.messageId) {
      await interaction.reply({
        content: "❌ Confession is not enabled in this server.",
        ephemeral: true,
      })
      return
    }

    // Coba edit message-nya untuk hapus button
    try {
      const channel = await interaction.guild?.channels.fetch(config.channelId)

      if (channel?.type === ChannelType.GuildText) {
        const message = await channel.messages.fetch(config.messageId)
        await message.edit({ components: [] })
      }
    } catch {
      // Kalau gagal fetch/edit message, biarkan saja
    }

    // Update isActive ke false
    config.isActive = false
    config.updatedAt = new Date()

    await this.confessionChannelRepo.save(config)

    await interaction.reply({
      content: "✅ Confession feature has been disabled.",
      ephemeral: true,
    })
  }
}
