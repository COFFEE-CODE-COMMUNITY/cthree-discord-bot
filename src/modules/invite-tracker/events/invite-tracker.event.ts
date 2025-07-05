import { Inject, Injectable } from "@nestjs/common"
import { Context, On, Once } from "necord"
import { Client, GuildMember } from "discord.js"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { LoadCacheInviteUseCase } from "../use-cases/load-cache-invite.use-case"
import { TrackInviteUseCase } from "../use-cases/track-invite.use-case"

@Injectable()
export class InviteTrackerEvent {
  public constructor(
    private readonly loadCacheInviteUseCase: LoadCacheInviteUseCase,
    private readonly trackInviteUseCases: TrackInviteUseCase,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  @Once("ready")
  public async onReady(@Context() [client]: [Client]): Promise<void> {
    this.logger.log("Client is ready, delegating to LoadInvitesCacheUseCase.")

    await this.loadCacheInviteUseCase.execute(client)
  }

  @On("guildMemberAdd")
  public async onGuildMemberAdd(@Context() [member]: [GuildMember]): Promise<void> {
    await this.trackInviteUseCases.execute(member)
  }
}
