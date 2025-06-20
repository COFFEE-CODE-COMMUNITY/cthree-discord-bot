import { Injectable, Inject } from "@nestjs/common"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { RoleStatMap } from "../constants/stat-server.constants"
import { Guild } from "discord.js"

@Injectable()
export class UpdateStatServerUseCases {
  private previousCount: Record<string, number> = {}

  public constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  public async execute(guild: Guild, mappings: RoleStatMap[]): Promise<void> {
    this.logger.log(`Executing stats  update for guild: ${guild.name}`)

    for (const map of mappings) {
      try {
        const count = guild.members.cache.filter(m => m.roles.cache.has(map.roleId)).size

        const lastCount = this.previousCount[map.roleId] ?? -1

        if (count !== lastCount) {
          this.logger.log(`Changes detected for ${map.label}: ${lastCount} -> ${count}`)
          this.previousCount[map.roleId] = count
          const channel = await guild.channels.fetch(map.channelId)

          if (channel && "setName" in channel) {
            const newName = `${map.label}: ${count}`
            if (channel.name !== newName) {
              await channel.setName(newName)
              this.logger.log(`Channel for "${map.label}" successfully updated to "${newName}"`)
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error updating stats for "${map.label}":`, error)
      }
    }
  }
}
