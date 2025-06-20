import { Module } from "@nestjs/common"
import { NecordModule, NecordModuleOptions } from "necord"
import { InfrastructureModule } from "./infrastructure/infrastructure.module"
import { SecretManager } from "./common/abstracts/secret/secret-manager.abstract"
import { GatewayIntentBits } from "discord.js"
import { AppEvent } from "./app.event"
import { FeedbackModule } from "./modules/feedback/feedback.module"
import { BoosterModule } from "./modules/booster/booster.module"
import { WelcomeModule } from "./modules/welcome/welcome.module"
import { StatsServerModule } from "./modules/stat-server/stat-server.module"

@Module({
  imports: [
    NecordModule.forRootAsync({
      async useFactory(secret: SecretManager): Promise<NecordModuleOptions> {
        return {
          token: await secret.getOrThrow("DISCORD_BOT_TOKEN"),
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent,
          ],
        }
      },
      inject: [SecretManager],
    }),
    InfrastructureModule,
    FeedbackModule,
    BoosterModule,
    WelcomeModule,
    StatsServerModule,
  ],
  providers: [
    // Events
    AppEvent,
  ],
})
export class AppModule {}
