import { Injectable } from "@nestjs/common"
import { Context, Options, SlashCommand, SlashCommandContext } from "necord"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { EnableStickyMessageUseCase } from "../use-cases/enable-sticky-message.use-case"

@Injectable()
@SlashCommand({
  name: "sticky-message",
  description: "",
  guilds: [process.env.C3_GUILD_ID as string],
})
export class StickyMessageCommand {
  public constructor(private readonly enableStickyMessageUsecase: EnableStickyMessageUseCase) {}

  @SlashCommand({
    name: "enable",
    description: "Enable sticky message.",
  })
  public async enable(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: EnableStickyMessageDto,
  ): Promise<void> {
    await this.enableStickyMessageUsecase.execute(interaction, options)
  }
}
