import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule } from "@nestjs/config"
import { resolve } from "path"
import { readFileSync } from "fs"
import { existsSync } from "node:fs"
import _ from "lodash"

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        (): any => {
          const env = process.env.NODE_ENV || "development"
          const defaultConfigPath = resolve(__dirname, "..", "..", "..", "app-config.json")
          const envConfigPath = resolve(__dirname, "..", "..", "..", `app-config.${env}.json`)
          let config = JSON.parse(readFileSync(defaultConfigPath, "utf-8"))

          if (existsSync(envConfigPath)) {
            config = _.merge(config, JSON.parse(readFileSync(envConfigPath, "utf-8")))
          }

          return _.merge(config, { app: { nodeEnv: env } })
        },
      ],
    }),
  ],
})
export class ConfigModule {}
