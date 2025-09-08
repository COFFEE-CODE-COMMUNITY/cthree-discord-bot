import { ChatInputCommandInteraction } from "discord.js"
import { Inject, Injectable } from "@nestjs/common"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class DisableConfessionUseCase {
  public constructor(@Inject(LOGGER) private readonly logger: Logger) {}
  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    this.logger.log(interaction.toString())
  }
}
