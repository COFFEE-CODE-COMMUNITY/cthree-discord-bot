import { Inject, Injectable } from "@nestjs/common"
import { Message, EmbedBuilder } from "discord.js"
import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"

@Injectable()
export class ReplyConfessionThreadUseCase {
  public constructor(@Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService) {}

  public async execute(message: Message): Promise<void> {
    const thread = message.channel

    if (!thread.isThread() || !message.guildId) return

    const parentChannelId = thread.parentId
    const guildId = message.guildId

    const activeChannel = await this.confessionService.getConfessionChannel(guildId)

    if (!activeChannel || activeChannel.channelId !== parentChannelId) return

    // Hapus pesan user
    try {
      await message.delete()
    } catch {
      return
    }

    // Siapkan embed dari isi pesan user
    const embed = new EmbedBuilder()
      .setDescription(message.content || "(no content)")
      .setColor("Random")
      .setFooter({ text: "Anonymous Reply" })
      .setTimestamp()

    // Kirim embed sebagai reply jika message adalah balasan
    if (message.reference?.messageId) {
      try {
        const repliedMsg = await thread.messages.fetch(message.reference.messageId)

        await thread.send({
          embeds: [embed],
          reply: {
            messageReference: repliedMsg.id,
          },
        })
        return
      } catch {
        // fallback jika gagal fetch reply
      }
    }

    // Kirim embed biasa (tanpa reply)
    await thread.send({ embeds: [embed] })
  }
}
