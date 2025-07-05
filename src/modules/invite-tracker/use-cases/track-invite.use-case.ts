import { Inject, Injectable } from "@nestjs/common"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { Collection, EmbedBuilder, GuildMember, TextChannel } from "discord.js"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { inviteCache } from "../constants/cache-collection.constants"

@Injectable()
export class TrackInviteUseCase {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly secretManager: SecretManager,
  ) {}

  public async execute(member: GuildMember): Promise<void> {
    const inviteChannel = await this.secretManager.getOrThrow("C3_INVITE_CHANNEL_ID")
    const { guild } = member

    try {
      const cachedInvites = inviteCache.get(guild.id)
      if (!cachedInvites) {
        this.logger.warn(`Invite cache not found for guild: ${guild.name}`)
        return
      }

      const newInvites = await guild.invites.fetch()

      const usedInvites = newInvites.find(invite => (cachedInvites.get(invite.code) ?? 0) < (invite.uses ?? 0))

      const newInviteUses = new Collection<string, number>(newInvites.map(invite => [invite.code, invite.uses ?? 0]))
      inviteCache.set(guild.id, newInviteUses)

      const channel = guild.channels.cache.get(inviteChannel) as TextChannel

      // Embed
      const embed = new EmbedBuilder()
        .setColor(0x1c567a)
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
        .setThumbnail(member.user.displayAvatarURL())
        .addFields({ name: "Member", value: `${member}`, inline: true })
        .setTimestamp()

      if (usedInvites?.inviter) {
        embed
          .setTitle("👋 Member Baru Bergabung!")
          .setDescription(`${member.user.tag} telah bergabung ke server.`)
          .addFields(
            { name: "Diundang oleh", value: `${usedInvites.inviter}`, inline: true },
            { name: "Kode Invite", value: `\`${usedInvites.code}\``, inline: true },
          )
      } else {
        embed
          .setTitle("👋 Member Baru Bergabung! (Sumber Tidak Diketahui)")
          .setDescription(
            `${member.user.tag} bergabung, namun pengundang tidak dapat dilacak. Kemungkinan melalui vanity URL atau tautan sementara.`,
          )
      }

      await channel.send({ embeds: [embed] })
    } catch (error) {
      this.logger.error("Error in TrackInviteUseCase:", error)
    }
  }
}
