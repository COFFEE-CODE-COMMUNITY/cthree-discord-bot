export const STICKY_MESSAGE_SERVICE = Symbol("StickyMessageService")

export interface TemporaryUserPayload {
  channelId?: string
}

export interface StickyMessageService {
  setTemporaryUser(userId: string, payload: TemporaryUserPayload): void
  getTemporaryUser(userId: string): TemporaryUserPayload | null
  deleteTemporaryUser(userId: string): void
}
