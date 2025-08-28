import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, Interaction } from "discord.js"
import { Injectable } from "@nestjs/common"

@Injectable()
export class InputTakeRoleChannelUseCase {
  public async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isRepliable()) return

    const channelSelectMenu = new ChannelSelectMenuBuilder()
      .setCustomId("takeRoleSelectChannel")
      .setPlaceholder("Pilih channel tujuan pengiriman embed")
      .addChannelTypes(ChannelType.GuildText)
      .setMinValues(1)
      .setMaxValues(1)

    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
      .addComponents(channelSelectMenu)

    const response = {
      content: "Silakan pilih channel tujuan pengiriman embed:",
      components: [row],
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(response)
    } else {
      await interaction.reply(response)
    }
  }
}
