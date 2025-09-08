import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommandContext, Subcommand } from "necord"
import { ConfessionSlashCommand } from "../decorators/confession-slash-command.decorator"
import { EnableConfessionDto } from "../dtos/enable-confession.dto"

@Injectable()
@ConfessionSlashCommand()
export class ConfessionCommand {
  public constructor(
    private readonly enableConfessionUseCase: any,
    private readonly disableConfessionUseCase: any,
  ) {}

  @Subcommand({
    name: "enable",
    description: "Enable confession.",
  })
  public async enable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: EnableConfessionDto,
  ): Promise<void> {
    await this.enableConfessionUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "disable",
    description: "Disable confession.",
  })
  public async disable(@Context() [interaction]: SlashCommandContext): Promise<void> {
    await this.disableConfessionUseCase.execute(interaction)
  }
}
