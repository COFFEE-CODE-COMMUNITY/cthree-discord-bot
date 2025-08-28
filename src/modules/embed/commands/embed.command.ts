import { Injectable, UseInterceptors } from "@nestjs/common"
import { EmbedSlashCommand } from "../decorators/embed-slash-command.decorator"
import { Context, SlashCommandContext, Subcommand, Options } from "necord"
import { CreateEmbedUseCase } from "../use-cases/create-embed.use-case"
import { CreateEmbedDto } from "../dtos/create-embed.dto"
import { EmbedAutocompleteInterceptor } from "../interceptors/embed-autocomplete.interceptor"
import { EditEmbedUseCase } from "../use-cases/edit-embed.use-case"
import { EditEmbedDto } from "../dtos/edit-embed.dto"
import { ShowEmbedUseCase } from "../use-cases/show-embed.use-case"

@EmbedSlashCommand()
@Injectable()
export class EmbedCommand {
  public constructor(
    private readonly createEmbedUseCase: CreateEmbedUseCase,
    private readonly editEmbedUseCase: EditEmbedUseCase,
    private readonly showEmbedUseCase: ShowEmbedUseCase,
  ) {}

  @Subcommand({
    name: "create",
    description: "Create a new embed",
  })
  public async create(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: CreateEmbedDto,
  ): Promise<void> {
    await this.createEmbedUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "edit",
    description: "Edit an existing embed",
  })
  @UseInterceptors(EmbedAutocompleteInterceptor)
  public async edit(@Context() [interaction]: SlashCommandContext, @Options() options: EditEmbedDto): Promise<void> {
    await this.editEmbedUseCase.execute(interaction, options)
  }

  @Subcommand({
    name: "show",
    description: "Show an existing embed",
  })
  @UseInterceptors(EmbedAutocompleteInterceptor)
  public async show(@Context() [interaction]: SlashCommandContext, @Options() options: EditEmbedDto): Promise<void> {
    await this.showEmbedUseCase.execute(interaction, options)
  }
}
