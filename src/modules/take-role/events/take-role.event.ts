import { Injectable } from "@nestjs/common"
import { Context, On, ContextOf } from "necord"
import { ModalTakeRoleSubmitHandler } from "../handlers/modal-take-role-submit.handler"
import { SelectTakeRoleChannelHandler } from "../handlers/select-take-role-channel.handler"
import { SelectTakeRoleRolesHandler } from "../handlers/select-take-role-roles.handler"
import { ButtonTakeRoleInteractionHandler } from "../handlers/button-take-role-interaction.handler"

@Injectable()
export class TakeRoleEvent {
  public constructor(
    private readonly modalSubmitHandlerHandler: ModalTakeRoleSubmitHandler,
    private readonly selectTakeRoleChannelHandler: SelectTakeRoleChannelHandler,
    private readonly selectTakeRoleRolesHandler: SelectTakeRoleRolesHandler,
    private readonly buttonTakeRoleInteractionHandler: ButtonTakeRoleInteractionHandler,
  ) {}

  @On("interactionCreate")
  public async onInteractionCreate(@Context() [interaction]: ContextOf<"interactionCreate">): Promise<void> {
    // Modal Submit
    if (interaction.isModalSubmit() && interaction.customId === "takeRoleModal") {
      await this.modalSubmitHandlerHandler.execute(interaction)
      return
    }

    // Channel Select
    if (interaction.isChannelSelectMenu() && interaction.customId === "takeRoleSelectChannel") {
      await this.selectTakeRoleChannelHandler.execute(interaction)
      return
    }

    // Role Select
    if (interaction.isRoleSelectMenu() && interaction.customId === "takeRoleSelectRoles") {
      await this.selectTakeRoleRolesHandler.execute(interaction)
      return
    }

    // Button Click
    if (interaction.isButton() && interaction.customId.startsWith("takeRoleBtn:")) {
      await this.buttonTakeRoleInteractionHandler.execute(interaction)
      return
    }
  }
}
