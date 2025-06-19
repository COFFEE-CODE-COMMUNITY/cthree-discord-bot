import { Global, Module } from "@nestjs/common"
import { LoggerModule } from "./logger/logger.module"
import { SecretModule } from "./secret/secret.module"
import { ConfigModule } from "./configs/config.module"

@Global()
@Module({
  imports: [ConfigModule, LoggerModule, SecretModule],
})
export class InfrastructureModule {}
