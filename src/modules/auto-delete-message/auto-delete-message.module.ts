import { Module } from "@nestjs/common"
import { AutoDeleteMessageCommand } from "./commands/auto-delete-message.command"
import { EnableAutoDeleteMessageUseCase } from "./use-cases/enable-auto-delete-message.use-case"

@Module({
  providers: [
    // Commands
    AutoDeleteMessageCommand,

    // Use Cases
    EnableAutoDeleteMessageUseCase,
  ],
})
export class AutoDeleteMessageModule {}
