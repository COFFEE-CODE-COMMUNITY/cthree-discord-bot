import { Module } from "@nestjs/common"
import { FeedbackEvent } from "./events/feedback.event"
import { FeedbackComponent } from "./components/feedback.component"

@Module({
  providers: [
    // Events
    FeedbackEvent,

    // Components
    FeedbackComponent,
  ],
})
export class FeedbackModule {}
