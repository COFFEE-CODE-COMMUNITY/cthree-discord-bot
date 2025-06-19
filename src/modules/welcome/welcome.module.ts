import { Module } from "@nestjs/common"
import { WelcomeEvent } from "./events/welcome.event"
import { GreetNewMemberUseCase } from "./use-cases/greet-new-member.use-case"

@Module({
  providers: [
    // Events
    WelcomeEvent,

    // Use cases
    GreetNewMemberUseCase,
  ],
})
export class WelcomeModule {}
