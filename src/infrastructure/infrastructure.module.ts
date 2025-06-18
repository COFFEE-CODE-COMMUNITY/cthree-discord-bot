import { Global, Module } from "@nestjs/common"
import { LoggerModule } from "./logger/logger.module"
import { SecretModule } from "./secret/secret.module"

@Global()
@Module({
  imports: [LoggerModule, SecretModule]
})
export class InfrastructureModule {}