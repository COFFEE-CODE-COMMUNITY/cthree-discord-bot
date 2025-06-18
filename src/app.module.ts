import { Module } from "@nestjs/common"
import { NecordModule, NecordModuleOptions } from "necord"
import { ConfigModule } from "./configs/config.module"
import { InfrastructureModule } from "./infrastructure/infrastructure.module"
import { SecretManager } from "./common/abstracts/secret/secret-manager.abstract"
import { GatewayIntentBits } from 'discord.js'
import { AppEvent } from "./app.event"

@Module({
  imports: [
    NecordModule.forRootAsync({
      async useFactory(secret: SecretManager): Promise<NecordModuleOptions> {
        return {
          token: await secret.getOrThrow('DISCORD_BOT_TOKEN'),
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent
          ]
        }
      },
      inject: [SecretManager]
    }),
    ConfigModule,
    InfrastructureModule
  ],
  providers: [
    // Events
    AppEvent
  ]
})
export class AppModule {}