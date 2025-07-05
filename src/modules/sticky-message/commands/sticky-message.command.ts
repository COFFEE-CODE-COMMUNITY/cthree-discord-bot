import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommand, SlashCommandContext } from "necord"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { EnableStickyMessageUseCase } from "../use-cases/enable-sticky-message.use-case"
import { DisableStickyMessageDto } from "../dtos/disable-sticky-message.dto"
import { DisableStickyMessageUseCase } from "../use-cases/disable-sticky-message.use-case"
import { ClearStickyMessageUseCase } from "../use-cases/clear-sticky-message.use-case"

@Injectable()
@SlashCommand({
  name: "sticky-message",
  description: "Sticky message.",
})
export class StickyMessageCommand {
  public constructor(
    private readonly enableStickyMessageUseCase: EnableStickyMessageUseCase,
    private readonly disableStickyMessageUseCase: DisableStickyMessageUseCase,
    private readonly clearStickyMessageUseCase: ClearStickyMessageUseCase,
  ) {}

  @SlashCommand({
    name: "enable",
    description: "Enable the sticky message.",
  })
  public async enable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: EnableStickyMessageDto,
  ): Promise<void> {
    await this.enableStickyMessageUseCase.execute(interaction, options)
  }

  @SlashCommand({
    name: "disable",
    description: "Disable the sticky message.",
  })
  public async disable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: DisableStickyMessageDto,
  ): Promise<void> {
    await this.disableStickyMessageUseCase.execute(interaction, options)
  }

  @SlashCommand({
    name: "clear",
    description: "Clear all sticky messages in the server.",
  })
  public async clear(@Context() [interaction]: SlashCommandContext): Promise<void> {
    await this.clearStickyMessageUseCase.execute(interaction)
  }
}
