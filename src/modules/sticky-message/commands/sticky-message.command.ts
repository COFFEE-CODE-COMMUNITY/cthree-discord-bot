import { Injectable } from "@nestjs/common"
import { Context, Options, Subcommand, SlashCommandContext } from "necord"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { EnableStickyMessageUseCase } from "../use-cases/enable-sticky-message.use-case"
import { DisableStickyMessageDto } from "../dtos/disable-sticky-message.dto"
import { DisableStickyMessageUseCase } from "../use-cases/disable-sticky-message.use-case"
import { ClearStickyMessageUseCase } from "../use-cases/clear-sticky-message.use-case"
import { StickyMessageSlashCommand } from "../decorators/sticky-message-slash-command.decorator"

@Injectable()
@StickyMessageSlashCommand()
export class StickyMessageCommand {
  public constructor(
    private readonly enableStickyMessageUseCase: EnableStickyMessageUseCase,
    private readonly disableStickyMessageUseCase: DisableStickyMessageUseCase,
    private readonly clearStickyMessageUseCase: ClearStickyMessageUseCase,
  ) {}

  @Subcommand({
    name: "enable",
    description: "Enable the sticky message.",
  })
  public async enable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: EnableStickyMessageDto,
  ): Promise<void> {
    await this.enableStickyMessageUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "disable",
    description: "Disable the sticky message.",
  })
  public async disable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: DisableStickyMessageDto,
  ): Promise<void> {
    await this.disableStickyMessageUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "clear",
    description: "Clear all sticky messages in the server.",
  })
  public async clear(@Context() [interaction]: SlashCommandContext): Promise<void> {
    await this.clearStickyMessageUseCase.execute(interaction)
  }
}
