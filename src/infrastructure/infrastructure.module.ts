import { Global, Module } from "@nestjs/common"
import { LoggerModule } from "./logger/logger.module"
import { SecretModule } from "./secret/secret.module"
import { ConfigModule } from "./configs/config.module"
import { DatabaseModule } from "./database/database.module"

@Global()
@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule, SecretModule],
})
export class InfrastructureModule {}
