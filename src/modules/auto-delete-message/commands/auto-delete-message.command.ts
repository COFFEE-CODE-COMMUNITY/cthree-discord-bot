import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommandContext, Subcommand } from "necord"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { EnableAutoDeleteMessageUseCase } from "../use-cases/enable-auto-delete-message.use-case"
import { AutoDeleteMessageSlashCommand } from "../decorators/auto-delete-message-slash-command.decorator"
import { DisableAutoDeleteMessageDto } from "../dtos/disable-auto-delete-message.dto"
import { DisableAutoDeleteMessageUseCase } from "../use-cases/disable-auto-delete-message.use-case"
import { ClearAutoDeleteMessageUseCase } from "../use-cases/clear-auto-delete-message.use-case"

@Injectable()
@AutoDeleteMessageSlashCommand()
export class AutoDeleteMessageCommand {
  public constructor(
    private readonly enableAutoDeleteMessageUseCase: EnableAutoDeleteMessageUseCase,
    private readonly disableAutoDeleteMessageUseCase: DisableAutoDeleteMessageUseCase,
    private readonly clearAutoDeleteMessageUseCase: ClearAutoDeleteMessageUseCase,
  ) {}

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

  @Subcommand({
    name: "disable",
    description: "Disable auto-delete messages.",
  })
  public async disable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: DisableAutoDeleteMessageDto,
  ): Promise<void> {
    await this.disableAutoDeleteMessageUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "clear",
    description: "Clear auto-delete messages in this guild.",
  })
  public async clear(@Context() [interaction]: SlashCommandContext): Promise<void> {
    await this.clearAutoDeleteMessageUseCase.execute(interaction)
  }
}
