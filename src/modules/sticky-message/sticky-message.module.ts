import { Module } from "@nestjs/common"
import { StickyMessageCommand } from "./commands/sticky-message.command"
import { STICKY_MESSAGE_SERVICE } from "./services/sticky-message.service"
import { StickyMessageServiceImpl } from "./services/sticky-message.service.impl"
import { EnableStickyMessageUseCase } from "./use-cases/enable-sticky-message.use-case"

@Module({
  providers: [
    // Commands
    StickyMessageCommand,
    
    // Components

    // Services
    {
      provide: STICKY_MESSAGE_SERVICE,
      useClass: StickyMessageServiceImpl,
    },

    // Use cases
    EnableStickyMessageUseCase,
  ],
})
export class StickyMessageModule {}
