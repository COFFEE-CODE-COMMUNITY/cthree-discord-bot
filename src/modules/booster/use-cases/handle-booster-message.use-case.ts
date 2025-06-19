import { Inject, Injectable } from "@nestjs/common"
import { AttachmentBuilder, EmbedBuilder, Message, TextChannel } from "discord.js"
import { BOOST_MESSAGE_TYPE } from "../constants/booster.constants"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { join } from "path"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class HandleBoosterMessageUseCase {
  public constructor(
    private readonly secret: SecretManager,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async execute(message: Message<true>): Promise<void> {
    const boostChannelId = await this.secret.getOrThrow("C3_BOOST_CHANNEL_ID")
    const customRoleId = await this.secret.getOrThrow("C3_PERKY")
    const isBoost = message.content.toLowerCase().includes("boost") || BOOST_MESSAGE_TYPE.includes(message.type)

    if (message.channelId !== boostChannelId || !message.member || !isBoost) return

    const { member, guild, client } = message
    const user = member.user

    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 } as { dynamic: boolean; size: number })
    const attachment = new AttachmentBuilder(join(process.cwd(), "src", "assets", "images", "server-boost.gif"), {
      name: "server-boost.gif",
    })

    const boostLevel = ["0", "1", "2", "3"][guild.premiumTier]
    const totalBoost = guild.premiumSubscriptionCount
    const serverMention = `<@${member.id}>`

    const embed = new EmbedBuilder()
      .setColor(0xeb459e)
      .setAuthor({
        name: `${user.username} telah booster server ini!`,
        iconURL: "attachment://server-boost.gif",
      })
      .setDescription(
        `Hi, ${serverMention}! Terimakasih untuk booster-nya💎.\n` +
          `Karena-mu, kita punya ${totalBoost} total boost.\n` +
          `Selamat! kamu juga dapat role <@&${customRoleId}>.`,
      )
      .setThumbnail(avatarUrl)
      .setFooter({
        text: `Level server saat ini : ${boostLevel}.`,
      })

    const targetChannel = await client.channels.fetch(boostChannelId)
    try {
      await message.delete()
    } catch (err) {
      console.error(err)
    }

    if (targetChannel instanceof TextChannel) {
      await targetChannel.send({
        content: serverMention,
        embeds: [embed],
        files: [attachment],
      })
    } else {
      console.error("Target channel bukan Text Channel.")
    }
  }
}
