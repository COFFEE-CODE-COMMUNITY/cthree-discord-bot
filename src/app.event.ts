import { Inject, Injectable } from "@nestjs/common"
import { Logger, LOGGER } from "./common/interfaces/logger/logger.interface"
import { Context, Once, On, ContextOf, ExplorerService, CommandsService, SlashCommandDiscovery, SlashCommandsService, SlashCommand } from "necord"
import { SecretManager } from "./common/abstracts/secret/secret-manager.abstract"

@Injectable()
export class AppEvent {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly secretManager: SecretManager,
    private readonly slashCommandsService: SlashCommandsService,
    private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
    private readonly commandsService: CommandsService,
  ) {}

  @Once("ready")
  public onReady(@Context() [client]: ContextOf<"ready">): void {
    this.logger.info(`Logged in as ${client.user.tag} (${client.user.id})`)
    this.logger.info("Discord bot is ready!")
  }

  @On("debug")
  public onDebug(@Context() [message]: ContextOf<"debug">): void {
    this.logger.debug(message)
  }

  @On("warn")
  public onWarn(@Context() [message]: ContextOf<"warn">): void {
    this.logger.warn(message)
  }

  @On("error")
  public onError(@Context() [error]: ContextOf<"error">): void {
    this.logger.error(error.message, error)
  }

  @Once("ready")
  public async registerCommands(): Promise<void> {
    this.logger.verbose("Updating metadata for SlashCommands...")

    const slashCommands = this.explorerService.explore(SlashCommand.KEY)
    const c3GuildId = await this.secretManager.getOrThrow("C3_GUILD_ID")

    for (const command of slashCommands) {
      const commandName = command.getName()
      this.slashCommandsService.remove(commandName)

      this.logger.verbose(`Updating metadata for SlashCommand: ${commandName}`)

      command.setGuilds([c3GuildId])
      this.slashCommandsService.add(command)
      await this.commandsService.registerInGuild(c3GuildId)
    }
  }
}
