import { Inject, Injectable } from "@nestjs/common"
import { Collection, Client } from "discord.js"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { inviteCache } from "../constants/cache-collection.constants"

@Injectable()
export class LoadCacheInviteUseCase {
  public constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  public async execute(client: Client): Promise<void> {
    this.logger.log("Loading invite cache...")

    const guilds = client.guilds.cache.values()
    for (const guild of guilds) {
      try {
        const fetchedInvites = await guild.invites.fetch()
        const usedInvites = new Collection<string, number>(
          fetchedInvites.map(invite => [invite.code, invite.uses ?? 0]),
        )
        inviteCache.set(guild.id, usedInvites)

        this.logger.log(`Cached ${usedInvites.size} invites for guild: ${guild.name}`)
      } catch (error) {
        this.logger.error(`Failed to fetch invites for guild: ${guild.name}`, error)
      }
    }
    this.logger.log("Finished caching all guild invites.")
  }
}
