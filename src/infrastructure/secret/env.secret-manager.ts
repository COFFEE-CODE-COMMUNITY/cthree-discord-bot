import { SecretManager } from "../../common/abstracts/secret/secret-manager.abstract"
import { Injectable, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { NodeEnv } from "../../common/enums/node-env.enum"

@Injectable()
export class EnvSecretManager extends SecretManager {
  public constructor(@Inject() config: ConfigService) {
    super()

    dotenvConfig({ path: resolve(process.cwd(), ".env") })
    dotenvConfig({
      path: resolve(process.cwd(), `.env.${config.get<NodeEnv>("app.nodeEnv", NodeEnv.DEVELOPMENT)}`),
      override: true,
    })
  }

  public get(key: string): Promise<string | null> {
    return Promise.resolve(process.env[key] || null)
  }
}
