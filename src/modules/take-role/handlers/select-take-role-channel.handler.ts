import { Injectable } from "@nestjs/common"
import { Interaction } from "discord.js"
import { takeRoleCache } from "../constants/take-role-cache.constant"
import { InputTakeRoleRolesUseCase } from "../use-cases/input-take-role-roles.use-case"

@Injectable()
export class SelectTakeRoleChannelHandler {
  public constructor(private readonly inputTakeRoleRolesUseCase: InputTakeRoleRolesUseCase) {}

  public async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isChannelSelectMenu()) return
    if (interaction.customId !== "takeRoleSelectChannel") return

    const userId = interaction.user.id
    const cached = takeRoleCache.get(userId)

    if (!cached) {
      await interaction.reply({
        content: "Data take-role tidak ditemukan. Silakan mulai dari awal dengan /take-role create.",
        ephemeral: true,
      })
      return
    }

    const selectedChannelId = interaction.values[0]

    takeRoleCache.set(userId, Object.assign({}, cached, { channelId: selectedChannelId }))

    await interaction.reply({
      content: `Channel tujuan berhasil dipilih: <#${selectedChannelId}>. Sekarang pilih role yang ingin dimasukkan.`,
      ephemeral: true,
    })

    await this.inputTakeRoleRolesUseCase.execute(interaction)
  }
}
