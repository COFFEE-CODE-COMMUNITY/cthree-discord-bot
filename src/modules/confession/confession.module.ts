import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EnableConfessionUseCase } from "./use-cases/enable-confession.use-case"
import { ConfessionCommand } from "./commands/confession.command"
import { ConfessionComponent } from "./components/confession.component"
import { ConfessionRepository } from "./repositories/confession.repository"
import { ConfessionChannelRepository } from "./repositories/confession-channel.repository"
import { CONFESSION_SERVICE } from "./services/confession.service"
import { ConfessionServiceImpl } from "./services/confession.service.impl"
import { ShowConfessionModalUseCase } from "./use-cases/show-confession-modal.use-case"
import { ConfessionChannel } from "./entities/confession-channel.entity"
import { Confession } from "./entities/confession.entity"
import { CreateConfessionEmbedUseCase } from "./use-cases/create-confession-embed.use-case"
import { CreateConfessionThreadUseCase } from "./use-cases/create-confession-thread.use-case"
import { DisableConfessionUseCase } from "./use-cases/disable-confession.use-case"
import { ReplyConfessionThreadUseCase } from "./use-cases/reply-confession-thread.use-case"
import { ConfessionEvent } from "./events/confession.event"

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

    // Events
    ConfessionEvent,

    // Services
    {
      provide: CONFESSION_SERVICE,
      useClass: ConfessionServiceImpl,
    },

    // Use cases
    EnableConfessionUseCase,
    ShowConfessionModalUseCase,
    CreateConfessionEmbedUseCase,
    CreateConfessionThreadUseCase,
    DisableConfessionUseCase,
    ReplyConfessionThreadUseCase,
  ],
})
export class ConfessionModule {}
