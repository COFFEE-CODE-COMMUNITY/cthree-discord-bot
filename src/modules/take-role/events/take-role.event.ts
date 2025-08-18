// import { ShowTakeRoleModalUseCase } from "../use-cases/show-take-role-modal.use-case"
// import {Context, SlashCommand, SlashCommandContext} from "necord";
//
// export class TakeRoleEvent {
//   public constructor(
//     private readonly showTakeRoleModalUseCase: ShowTakeRoleModalUseCase
//   ) {}
//
//   @SlashCommand({
//     name: 'take-role',
//     description: 'Show the take role modal',
//   })
//   public async onTakeRoleCommand(@Context() [interaction]: SlashCommandContext): Promise<void> {
//     await this.showTakeRoleModalUseCase.execute(interaction);
//   }
// }
