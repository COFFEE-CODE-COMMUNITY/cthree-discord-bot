import { Module } from "@nestjs/common"
import { InviteTrackerEvent } from "./events/invite-tracker.event"
import { LoadCacheInviteUseCase } from "./use-cases/load-cache-invite.use-case"
import { TrackInviteUseCases } from "./use-cases/track-invite.use-cases"

@Module({
  providers: [InviteTrackerEvent, LoadCacheInviteUseCase, TrackInviteUseCases],
})
export class InviteTrackerModule {}
