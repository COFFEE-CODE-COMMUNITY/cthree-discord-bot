import { Injectable } from "@nestjs/common"
import { Interaction } from "discord.js"
import { CreateTakeRoleDto } from "../dtos/create-take-role.dto"
import { takeRoleCache } from "../constants/take-role-cache.constant"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { InputTakeRoleChannelUseCase } from "../use-cases/input-take-role-channel.use-case"

@Injectable()
export class ModalTakeRoleSubmitHandler {
  public constructor(
    private readonly inputTakeRoleChannel: InputTakeRoleChannelUseCase,
    private readonly secret: SecretManager,
  ) {}

  public async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isModalSubmit()) return
    if (interaction.customId !== "takeRoleModal") return

    const message = interaction.fields.getTextInputValue("message") || null
    const embedTitle = interaction.fields.getTextInputValue("embedTitle")
    const embedBody = interaction.fields.getTextInputValue("embedBody")
    const embedColor = interaction.fields.getTextInputValue("embedColor") || "#2f3136"
    const imageUrl = interaction.fields.getTextInputValue("imageUrl") || null

    const data: CreateTakeRoleDto = {
      guildId: await this.secret.getOrThrow("C3_GUILD_ID"),
      userId: interaction.user.id,
      channelId: "",
      roleIds: [],
      message,
      embedTitle,
      embedBody,
      embedColor,
      imageUrl,
    }

    takeRoleCache.set(interaction.user.id, data)

    await interaction.reply({
      content: "Berhasil! Sekarang silakan pilih channel tujuan.",
      ephemeral: true,
    })

    await this.inputTakeRoleChannel.execute(interaction)
  }
}
