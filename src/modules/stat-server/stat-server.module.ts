import { Module } from "@nestjs/common"
import { StatServerEvent } from "./events/stat-server.event"
import { UpdateStatServerUseCases } from "./use-cases/update-stat-server.use-cases"
import { StatServerService } from "./services/stat-server.service"

@Module({
  providers: [StatServerService, UpdateStatServerUseCases, StatServerEvent],
})
export class StatsServerModule {}
