import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommandContext, Subcommand } from "necord"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { EnableAutoDeleteMessageUseCase } from "../use-cases/enable-auto-delete-message.use-case"

@Injectable()
@AutoDeleteMessageCommand()
export class AutoDeleteMessageCommand {
  public constructor(private readonly enableAutoDeleteMessageUseCase: EnableAutoDeleteMessageUseCase) {}

  @Subcommand({
    name: "enable",
    description: "Enable auto-delete messages.",
  })
  public async enable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: EnableAutoDeleteMessageDto,
  ): Promise<void> {
    await this.enableAutoDeleteMessageUseCase.execute(interaction, options)
  }
}
