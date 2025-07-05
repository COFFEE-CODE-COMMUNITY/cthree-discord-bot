import { Module } from "@nestjs/common"
import { InviteTrackerEvent } from "./events/invite-tracker.event"
import { LoadCacheInviteUseCase } from "./use-cases/load-cache-invite.use-case"
import { TrackInviteUseCase } from "./use-cases/track-invite.use-case"

@Module({
  providers: [InviteTrackerEvent, LoadCacheInviteUseCase, TrackInviteUseCase],
})
export class InviteTrackerModule {}
