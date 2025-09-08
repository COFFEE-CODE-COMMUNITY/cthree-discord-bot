import { Module } from "@nestjs/common"
import { EnableConfessionUseCase } from "./use-cases/enable-confession.use-case"
import { ConfessionCommand } from "./commands/confession.command"
import { ConfessionComponent } from "./components/confession.component"
import { ConfessionRepository } from "./repositories/confession.repository"
import { ConfessionChannelRepository } from "./repositories/confession-channel.repository"
import { CONFESSION_SERVICE } from "./services/confession.service"
import { ConfessionServiceImpl } from "./services/confession.service.impl"
import { ShowConfessionModalUseCase } from "./use-cases/show-confession-modal.use-case"
import { DisableConfessionUseCase } from "./use-cases/disable-confession.use-case"
import { ConfessionChannel } from "./entities/confession-channel.entity"
import { Confession } from "./entities/confession.entity"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [TypeOrmModule.forFeature([Confession, ConfessionChannel])],
  providers: [
    // Commands
    ConfessionCommand,

    // Components
    ConfessionComponent,

    // Repositories
    ConfessionRepository,
    ConfessionChannelRepository,

    // Services
    {
      provide: CONFESSION_SERVICE,
      useClass: ConfessionServiceImpl,
    },

    // Use cases
    EnableConfessionUseCase,
    ShowConfessionModalUseCase,
    DisableConfessionUseCase,
  ],
})
export class ConfessionModule {}
