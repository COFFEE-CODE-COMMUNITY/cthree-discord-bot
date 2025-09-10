import { Inject, Injectable } from "@nestjs/common"
import { EnableConfessionDto } from "../dtos/enable-confession.dto"
import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, TextChannel } from "discord.js"

import { CREATE_CONFESSION_BTN, REPLY_CONFESSION_BTN } from "../constants/custom-id.constant"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class EnableConfessionUseCase {
  public constructor(
    @Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(interaction: any, dto: EnableConfessionDto): Promise<void> {
    const { channel } = dto

    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: "Invalid channel type.", ephemeral: true })
      return
    }

    const textChannel = channel as TextChannel

    const confessionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(CREATE_CONFESSION_BTN)
        .setLabel("Make a Confession")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(REPLY_CONFESSION_BTN)
        .setLabel("Reply Confession")
        .setStyle(ButtonStyle.Secondary),
    )

    const confessionEmbed = new EmbedBuilder()
      .setTitle("📢 Confession is now enabled!")
      .setDescription("Click the button below to make an anonymous confession or reply to one.")
      .setColor("Blurple")

    const existing = await this.confessionService.getConfessionChannel(interaction.guildId)

    if (existing?.messageId) {
      try {
        const existingMessage = await textChannel.messages.fetch(existing.messageId)

        await existingMessage.edit({
          embeds: [confessionEmbed],
          components: [confessionRow],
        })

        await this.confessionService.setConfessionChannel(interaction.guildId, textChannel.id, existingMessage.id)

        await interaction.reply({ content: "Confession has been updated in the selected channel.", ephemeral: true })
        return
      } catch (err) {
        this.logger.error(`Error while edited message: ${err}`)
      }
    }

    const sentMessage = await textChannel.send({
      embeds: [confessionEmbed],
      components: [confessionRow],
    })

    await this.confessionService.setConfessionChannel(interaction.guildId, textChannel.id, sentMessage.id)

    await interaction.reply({
      content: "Confession has been enabled in the selected channel.",
      ephemeral: true,
    })
  }
}
