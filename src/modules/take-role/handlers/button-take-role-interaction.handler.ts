import { Injectable } from "@nestjs/common"
import { ButtonInteraction, GuildMember } from "discord.js"

@Injectable()
export class ButtonTakeRoleInteractionHandler {
  public async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.customId.startsWith("takeRoleBtn:")) return

    const [, , roleId] = interaction.customId.split(":")

    if (!interaction.guild) {
      await interaction.reply({
        content: "Interaction ini hanya bisa digunakan di dalam server.",
        ephemeral: true,
      })
      return
    }

    const role = interaction.guild.roles.cache.get(roleId)
    if (!interaction.member) {
      await interaction.reply({
        content: "Gagal mendapatkan informasi member.",
        ephemeral: true,
      })
      return
    }

    const member = interaction.member as GuildMember

    if (!role) {
      await interaction.reply({
        content: "Role tidak ditemukan.",
        ephemeral: true,
      })
      return
    }

    const hasRole = member.roles.cache.has(roleId)

    if (hasRole) {
      await member.roles.remove(roleId)
      await interaction.reply({
        content: `✅ Role **${role.name}** berhasil dihapus dari kamu.`,
        ephemeral: true,
      })
    } else {
      await member.roles.add(roleId)
      await interaction.reply({
        content: `✅ Kamu telah diberi role **${role.name}**.`,
        ephemeral: true,
      })
    }
  }
}
