import { Injectable, Inject } from "@nestjs/common"
import { Guild, Client } from "discord.js"
import { RoleStatMap, STAT_DEFINITIONS } from "../constants/stat-server.constants"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { SecretManager } from "../../../common/abstracts/secret/secret-manager.abstract"
import { UpdateStatServerUseCases } from "../use-cases/update-stat-server.use-cases"

@Injectable()
export class StatServerService {
  private guild!: Guild
  private activeMappings: RoleStatMap[] = []

  public constructor(
    @Inject(Client) private readonly client: Client,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly secretManager: SecretManager,
    private readonly updateStatServerUseCases: UpdateStatServerUseCases,
  ) {}

  public async initialize(): Promise<void> {
    this.logger.log(`Client is ready. Initializing Stat Service...`)

    await this.loadMappingsFromSecret()
    if (this.activeMappings.length === 0) {
      this.logger.error("No stat mappings loaded. Service will halt.")
      return
    }

    try {
      const guildId = await this.secretManager.getOrThrow("C3_GUILD_ID")
      this.guild = await this.client.guilds.fetch(guildId)
      await this.guild.members.fetch()
      this.logger.log(`Service is ready for guild: ${this.guild.name}`)

      await this.runUpdate()

      const interval = 6 * 60 * 60 * 1000 // 6 hours in milliseconds
      setInterval(() => {
        this.runUpdate().catch(error => {
          this.logger.error("An error occurred during scheduled stat update", error)
        })
      }, interval)

      this.logger.log(`Scheduled stats update to run every 6 hours.`)
    } catch (error) {
      this.logger.error("Failed during initial stat update.", error)
    }
  }

  private async runUpdate(): Promise<void> {
    this.logger.log("Executing stats update...")
    await this.updateStatServerUseCases.execute(this.guild, this.activeMappings)
  }

  private async loadMappingsFromSecret(): Promise<void> {
    this.logger.log("Loading stat mappings from SecretManager...")
    const loadedMappings: RoleStatMap[] = []

    for (const definition of STAT_DEFINITIONS) {
      try {
        const [roleId, channelId] = await Promise.all([
          this.secretManager.getOrThrow(definition.roleKey),
          this.secretManager.getOrThrow(definition.channelKey),
        ])

        loadedMappings.push({
          roleId,
          channelId,
          label: definition.label,
        })
      } catch (error) {
        this.logger.warn(`Could not load mapping for "${definition.label}". Reason: ${error}`)
      }
    }
    this.activeMappings = loadedMappings
    this.logger.log(`Loaded ${this.activeMappings.length} stat mappings.`)
  }
}
