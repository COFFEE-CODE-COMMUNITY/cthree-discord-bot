import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TakeRole } from "./entities/take-role.entity"
import { TakeRoleRepository } from "./repositories/take-role.repository"
import { TAKE_ROLE_SERVICE } from "./services/take-role.service"
import { TakeRoleServiceImpl } from "./services/take-role.service.impl"
import { ModalTakeRoleSubmitHandler } from "./handlers/modal-take-role-submit.handler"
import { SelectTakeRoleChannelHandler } from "./handlers/select-take-role-channel.handler"
import { SelectTakeRoleRolesHandler } from "./handlers/select-take-role-roles.handler"
import { ButtonTakeRoleInteractionHandler } from "./handlers/button-take-role-interaction.handler"
import { ShowTakeRoleModalUseCase } from "./use-cases/show-take-role-modal.use-case"
import { InputTakeRoleChannelUseCase } from "./use-cases/input-take-role-channel.use-case"
import { InputTakeRoleRolesUseCase } from "./use-cases/input-take-role-roles.use-case"
import { SendTakeRoleEmbedUseCase } from "./use-cases/send-take-role-embed.use-case"
import { TakeRoleEvent } from "./events/take-role.event"
import { TakeRoleCommand } from "./commands/take-role.command"

@Module({
  imports: [TypeOrmModule.forFeature([TakeRole])],
  providers: [
    // Event
    TakeRoleEvent,

    // Service & Repository
    TakeRoleRepository,
    {
      provide: TAKE_ROLE_SERVICE,
      useClass: TakeRoleServiceImpl,
    },

    // Handlers
    ModalTakeRoleSubmitHandler,
    SelectTakeRoleChannelHandler,
    SelectTakeRoleRolesHandler,
    ButtonTakeRoleInteractionHandler,

    // Use Cases
    ShowTakeRoleModalUseCase,
    InputTakeRoleChannelUseCase,
    InputTakeRoleRolesUseCase,
    SendTakeRoleEmbedUseCase,

    // Commands
    TakeRoleCommand,
  ],
})
export class TakeRoleModule {}
