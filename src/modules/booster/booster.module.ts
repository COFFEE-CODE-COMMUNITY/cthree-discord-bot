import { Module } from "@nestjs/common"
import { BoosterEvent } from "./events/booster.event"
import { HandleBoosterMessageUseCase } from "./use-cases/handle-booster-message.use-case"

@Module({
  providers: [
    // Events
    BoosterEvent,

    // Use Cases
    HandleBoosterMessageUseCase,
  ],
})
export class BoosterModule {}
