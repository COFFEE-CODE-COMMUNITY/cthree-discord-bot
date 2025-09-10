import { Injectable } from "@nestjs/common"
import { ButtonInteraction, ChannelType, ThreadAutoArchiveDuration, Message } from "discord.js"

@Injectable()
export class CreateConfessionThreadUseCase {
  public async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "This action can only be used in a text channel.",
        ephemeral: true,
      })
      return
    }

    const parentMessage: Message = interaction.message

    const titleFromEmbed = parentMessage.embeds[0].title ?? "Reply to Confession"

    const threadName = titleFromEmbed.slice(0, 100)

    if (parentMessage.hasThread) {
      await interaction.reply({
        content: "❗ Thread for this confession already exists.",
        ephemeral: true,
      })
      return
    }

    const thread = await parentMessage.startThread({
      name: threadName,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      reason: "User replied to confession",
    })

    await interaction.reply({
      content: `✅ Thread created: <#${thread.id}>`,
      ephemeral: true,
    })
  }
}
