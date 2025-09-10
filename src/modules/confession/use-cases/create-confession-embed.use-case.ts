import { Inject, Injectable } from "@nestjs/common"
import {
  ModalSubmitInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
} from "discord.js"
import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"
import { CREATE_CONFESSION_BTN, REPLY_CONFESSION_BTN } from "../constants/custom-id.constant"

@Injectable()
export class CreateConfessionEmbedUseCase {
  public constructor(@Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService) {}

  public async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const body = interaction.fields.getTextInputValue("body")
    const imageUrl = interaction.fields.getTextInputValue("imageUrl").trim()
    const guildId = interaction.guildId
    const channel = interaction.channel

    if (!guildId || !channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: "Something went wrong.", ephemeral: true })
      return
    }

    const confessionChannel = await this.confessionService.getConfessionChannel(guildId)

    if (!confessionChannel || confessionChannel.channelId !== channel.id || !confessionChannel.messageId) {
      await interaction.reply({ content: "Confession is not enabled in this channel.", ephemeral: true })
      return
    }

    const stats = await this.confessionService.getConfessionStatsByChannel(channel.id)
    const confessionTitle = `Confession #${stats.total + 1}`

    // Edit pesan lama: hapus komponen (button)
    try {
      const message = await channel.messages.fetch(confessionChannel.messageId)
      await message.edit({ components: [] })
    } catch {
      // gagal fetch = biarkan saja
    }

    const embed = new EmbedBuilder().setTitle(confessionTitle).setDescription(body).setColor("Random").setTimestamp()

    if (imageUrl && imageUrl.startsWith("http")) {
      embed.setImage(imageUrl)
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(CREATE_CONFESSION_BTN)
        .setLabel("Make a Confession")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(REPLY_CONFESSION_BTN)
        .setLabel("Reply Confession")
        .setStyle(ButtonStyle.Secondary),
    )

    // Coba kirim message
    let sent
    try {
      sent = await channel.send({
        embeds: [embed],
        components: [row],
      })
    } catch (err) {
      await interaction.reply({
        content: "❌ Failed to send confession. Please check your input or try again.",
        ephemeral: true,
      })
      return
    }

    // Simpan data ke DB hanya jika pesan berhasil dikirim
    await this.confessionService.deleteConfession(confessionChannel.messageId)

    await this.confessionService.saveConfession({
      messageId: sent.id,
      channelId: channel.id,
      guildId,
      title: confessionTitle,
      content: body,
    })

    await this.confessionService.setConfessionChannel(guildId, channel.id, sent.id)

    await interaction.reply({ content: "✅ Confession sent anonymously!", ephemeral: true })
  }
}
