import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger, LOGGER } from "./common/interfaces/logger/logger.interface"

class Main {
  public static async main(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule)
    const logger = await app.resolve<Logger>(LOGGER)

    app.useLogger(logger)

    await app.init()
    logger.info("Application initialized successfully")
  }
}
Main.main()
