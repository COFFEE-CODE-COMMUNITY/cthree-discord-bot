import { Global, Module } from "@nestjs/common"
import { WinstonLogger } from "./winston.logger"
import { LOGGER } from "../../common/interfaces/logger/logger.interface"

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useClass: WinstonLogger
    }
  ],
  exports: [LOGGER]
})
export class LoggerModule {}