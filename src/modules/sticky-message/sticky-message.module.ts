import { Module } from "@nestjs/common"
import { StickyMessageCommand } from "./commands/sticky-message.command"
import { STICKY_MESSAGE_SERVICE } from "./services/sticky-message.service"
import { StickyMessageServiceImpl } from "./services/sticky-message.service.impl"
import { EnableStickyMessageUseCase } from "./use-cases/enable-sticky-message.use-case"
import { TypeOrmModule } from "@nestjs/typeorm"
import { StickyMessage } from "./entities/sticky-message.entity"
import { STICKY_MESSAGE_REPOSITORY } from "./repositories/sticky-message.repository"
import { StickyMessageRepositoryImpl } from "./repositories/sticky-message.repository.impl"
import { StickyMessageComponent } from "./components/sticky-message.component"
import { StickyMessageEvent } from "./events/sticky-message.event"
import { ClearStickyMessageUseCase } from "./use-cases/clear-sticky-message.use-case"
import { DisableStickyMessageUseCase } from "./use-cases/disable-sticky-message.use-case"
import { CreateStickyMessageUseCase } from "./use-cases/create-sticky-message.use-case"
import { MoveStickyMessageToRecentUseCase } from "./use-cases/move-sticky-message-to-recent.use-case"

@Module({
  imports: [TypeOrmModule.forFeature([StickyMessage])],
  providers: [
    // Commands
    StickyMessageCommand,

    // Components
    StickyMessageComponent,

    // Events
    StickyMessageEvent,

    // Repositories
    {
      provide: STICKY_MESSAGE_REPOSITORY,
      useClass: StickyMessageRepositoryImpl,
    },

    // Services
    {
      provide: STICKY_MESSAGE_SERVICE,
      useClass: StickyMessageServiceImpl,
    },

    // Use cases
    ClearStickyMessageUseCase,
    CreateStickyMessageUseCase,
    DisableStickyMessageUseCase,
    EnableStickyMessageUseCase,
    MoveStickyMessageToRecentUseCase,
  ],
})
export class StickyMessageModule {}
