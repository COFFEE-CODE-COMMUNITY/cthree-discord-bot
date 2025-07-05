import { Injectable } from "@nestjs/common"
import { StickyMessageService, TemporaryUserPayload } from "./sticky-message.service"

@Injectable()
export class StickyMessageServiceImpl implements StickyMessageService {
  private readonly temporaryUsers = new Map<string, TemporaryUserPayload>()

  public setTemporaryUser(userId: string, payload: TemporaryUserPayload): void {
    this.temporaryUsers.set(userId, payload)
  }

  public getTemporaryUser(userId: string): TemporaryUserPayload | null {
    return this.temporaryUsers.get(userId) || null
  }
}
