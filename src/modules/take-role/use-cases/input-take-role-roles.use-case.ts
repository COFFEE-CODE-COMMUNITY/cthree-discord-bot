import { ActionRowBuilder, Interaction, RoleSelectMenuBuilder } from "discord.js"
import { Injectable } from "@nestjs/common"

@Injectable()
export class InputTakeRoleRolesUseCase {
  public async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isRepliable()) return

    const roleSelectMenu = new RoleSelectMenuBuilder()
      .setCustomId("takeRoleSelectRoles")
      .setPlaceholder("Pilih role yang ingin dimasukkan ke dalam embed")
      .setMinValues(1)
      .setMaxValues(25)

    const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleSelectMenu)

    const content = "Silakan pilih satu atau lebih role yang akan digunakan dalam embed take-role:"

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        content,
        components: [row],
      })
    } else {
      await interaction.reply({
        content,
        components: [row],
      })
    }
  }
}
