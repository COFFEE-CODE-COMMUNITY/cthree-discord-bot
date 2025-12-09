import { Inject, Injectable } from "@nestjs/common"
import { StickyMessageService, TemporaryUserPayload } from "./sticky-message.service"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class StickyMessageServiceImpl implements StickyMessageService {
  private readonly temporaryUsers = new Map<string, TemporaryUserPayload>()

  public constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  public setTemporaryUser(userId: string, payload: TemporaryUserPayload): void {
    this.temporaryUsers.set(userId, payload)
  }

  public getTemporaryUser(userId: string): TemporaryUserPayload | null {
    return this.temporaryUsers.get(userId) || null
  }

  public deleteTemporaryUser(userId: string): void {
    if (this.temporaryUsers.has(userId)) {
      this.temporaryUsers.delete(userId)
    } else {
      this.logger.warn(`Temporary user with ID ${userId} does not exist.`)
    }
  }
}
