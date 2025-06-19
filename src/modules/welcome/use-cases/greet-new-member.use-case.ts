import { Inject, Injectable } from "@nestjs/common"
import { GuildMember, AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas"
import { join } from "path"

@Injectable()
export class GreetNewMemberUseCase {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly secret: SecretManager,
  ) {
    GlobalFonts.registerFromPath(join("assets", "fonts", "Poppins-Bold.ttf"), "Poppins")
  }

  public async execute(member: GuildMember): Promise<void> {
    this.logger.verbose(`${member.user.username} has joined the guild.`)

    const welcomeChannel = member.guild.channels.cache.get(await this.secret.getOrThrow("C3_WELCOME_CHANNEL_ID"))

    if (!welcomeChannel) {
      this.logger.error("Welcome channel not found.")

      return
    }

    if (!welcomeChannel.isTextBased()) {
      this.logger.error("Welcome channel is not TextBased.")

      return
    }

    if (!welcomeChannel.isSendable()) {
      this.logger.error("Welcome channel is not Sendable.")

      return
    }

    // Create banner
    const background = await loadImage(join("assets", "images", "welcome-banner.png"))
    const canvas = createCanvas(background.width, background.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.font = "bold 72px Poppins"
    ctx.textAlign = "center"
    ctx.fillStyle = "#1f6faf"
    ctx.fillText(`WELCOME, ${member.user.username.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 50)

    const avatar = await loadImage(member.user.displayAvatarURL())
    const avatarSize = 250
    const avatarX = (canvas.width - avatarSize) / 2
    const avatarY = canvas.height / 2 - avatarSize - 40 // Adjust distance from text

    ctx.beginPath()
    ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize)

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "welcome-banner.png" })

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle("C3")
      .setAuthor({ name: "Coffee Code Community" })
      .setDescription(
        `Welcome ${member.toString()}\n\n` +
          "*Hai, Hai! Selamat Datang di C3*\n\n" + // Italic style
          "Halo untuk kamu yang baru bergabung! Kami senang bisa menyambutmu di sini.\n\n" +
          "Di komunitas ini, kamu akan menemukan berbagai informasi menarik seputar C3 " +
          "yang bisa membantu kamu lebih memahami tentang komunitas ini.\n\n" +
          "• Mau tahu lebih banyak soal C3? Cek di <#1289860748448759857>\n" +
          "• Punya ide keren atau masukan? Langsung tulis di <#1347594181752786995>",
      )
      .setColor(0x3498db)
      .setImage("attachment://welcome-banner.png")
      .setFooter({ text: "Copyright© 2024 Coffee Code Community" })

    await welcomeChannel.send({
      embeds: [embed],
      files: [attachment],
    })
  }
}
