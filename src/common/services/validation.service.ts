import { Inject, Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { Logger, LOGGER } from "../interfaces/logger/logger.interface"

@Injectable()
export class ValidationService {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly http: HttpService,
  ) {}

  public async isImageUrl(url: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(this.http.get(url))
      const contentType = response.headers["content-type"]

      this.logger.debug(`Content-Type for URL ${url}: ${contentType}`)

      return response.status === 200 && contentType !== undefined && (contentType as string).startsWith("image/")
    } catch (error) {
      return false
    }
  }
}
