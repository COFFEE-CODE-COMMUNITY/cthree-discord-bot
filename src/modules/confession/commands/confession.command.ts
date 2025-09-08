import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommandContext, Subcommand } from "necord"
import { ConfessionSlashCommand } from "../decorators/confession-slash-command.decorator"
import { EnableConfessionDto } from "../dtos/enable-confession.dto"
import { EnableConfessionUseCase } from "../use-cases/enable-confession.use-case"
import { DisableConfessionUseCase } from "../use-cases/disable-confession.use-case"

@Injectable()
@ConfessionSlashCommand()
export class ConfessionCommand {
  public constructor(
    private readonly enableConfessionUseCase: EnableConfessionUseCase,
    private readonly disableConfessionUseCase: DisableConfessionUseCase,
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
