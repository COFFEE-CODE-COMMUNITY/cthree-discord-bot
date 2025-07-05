import { Injectable, Inject } from "@nestjs/common"
import { Once } from "necord"
import { StatServerService } from "../services/stat-server.service"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class StatServerEvent {
  public constructor(
    private readonly statServerService: StatServerService,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  @Once("ready")
  public async onReady(): Promise<void> {
    this.logger.log("Ready event caught by StatsEvents. Triggering service...")

    await this.statServerService.initialize()
  }
}
