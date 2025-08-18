// import { Injectable } from "@nestjs/common"
// import { TakeRoleSlashCommand } from "../decorators/take-role-slash-command.decorator"
// import { Context, SlashCommandContext, Subcommand } from "necord"
// import { ShowTakeRoleModalUseCase } from "../use-cases/show-take-role-modal.use-case"
//
// @Injectable()
// @TakeRoleSlashCommand()
// export class TakeRoleCommand {
//   public constructor(
//     private readonly showTakeRoleModalUseCase: ShowTakeRoleModalUseCase,
//   ) {}
//
//   @Subcommand({
//     name: 'create',
//     description: 'Create a take role embed',
//   })
//   public async create(@Context() [interaction]: SlashCommandContext): Promise<void> {
//     await this.showTakeRoleModalUseCase.execute(interaction)
//   }
// }
