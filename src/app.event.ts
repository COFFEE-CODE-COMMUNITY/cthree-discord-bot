import { Inject, Injectable } from "@nestjs/common"
import { Logger, LOGGER } from "./common/interfaces/logger/logger.interface"
import { Context, Once, On, ContextOf } from "necord"

@Injectable()
export class AppEvent {
  public constructor(@Inject(LOGGER) private readonly logger: Logger) {}

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
}
