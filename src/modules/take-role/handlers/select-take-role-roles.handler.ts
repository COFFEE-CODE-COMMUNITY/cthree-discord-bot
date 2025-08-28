import { Inject, Injectable } from "@nestjs/common"
import { RoleSelectMenuInteraction } from "discord.js"
import { takeRoleCache } from "../constants/take-role-cache.constant"
import { ITakeRoleService, TAKE_ROLE_SERVICE } from "../services/take-role.service"
import { SendTakeRoleEmbedUseCase } from "../use-cases/send-take-role-embed.use-case"

@Injectable()
export class SelectTakeRoleRolesHandler {
  public constructor(
    @Inject(TAKE_ROLE_SERVICE) private readonly takeRoleService: ITakeRoleService,
    private readonly sendTakeRoleEmbedUseCase: SendTakeRoleEmbedUseCase,
  ) {}

  public async execute(interaction: RoleSelectMenuInteraction): Promise<void> {
    if (interaction.customId !== "takeRoleSelectRoles") return

    const userId = interaction.user.id
    const cached = takeRoleCache.get(userId)

    if (!cached || !cached.channelId) {
      await interaction.reply({
        content: "Data take-role tidak lengkap. Silakan mulai ulang dengan /take-role create.",
        ephemeral: true,
      })
      return
    }

    const selectedRoleIds = interaction.values

    const finalData = Object.assign({}, cached, {
      roleIds: selectedRoleIds,
      message: cached.message ?? undefined,
      imageUrl: cached.imageUrl ?? undefined,
    })

    const created = await this.takeRoleService.create(finalData)

    takeRoleCache.delete(userId)

    await interaction.reply({
      content: `Take-role berhasil dibuat untuk channel <#${finalData.channelId}> dengan ${selectedRoleIds.length} role.`,
      ephemeral: true,
    })

    await this.sendTakeRoleEmbedUseCase.execute(created.id, interaction.guild)
  }
}
