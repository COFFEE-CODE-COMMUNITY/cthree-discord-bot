import { Module } from "@nestjs/common"
import { AutoDeleteMessageCommand } from "./commands/auto-delete-message.command"
import { EnableAutoDeleteMessageUseCase } from "./use-cases/enable-auto-delete-message.use-case"
import { AutoDeleteMessageRepository } from "./repositories/auto-delete-message.repository"
import { DisableAutoDeleteMessageUseCase } from "./use-cases/disable-auto-delete-message.use-case"
import { ClearAutoDeleteMessageUseCase } from "./use-cases/clear-auto-delete-message.use-case"
import { AutoDeleteMessageEvent } from "./events/auto-delete-message.event"

@Module({
  providers: [
    // Commands
    AutoDeleteMessageCommand,

    // Events
    AutoDeleteMessageEvent,

    // Repositories
    AutoDeleteMessageRepository,

    // Use Cases
    ClearAutoDeleteMessageUseCase,
    EnableAutoDeleteMessageUseCase,
    DisableAutoDeleteMessageUseCase,
  ],
})
export class AutoDeleteMessageModule {}
