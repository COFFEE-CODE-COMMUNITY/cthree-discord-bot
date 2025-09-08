import { Confession } from "../entities/confession.entity"
import { ConfessionChannel } from "../entities/confession-channel.entity"

export const CONFESSION_SERVICE = Symbol("ConfessionService")

export interface IConfessionService {
  setConfessionChannel(guildId: string, channelId: string, messageId?: string): Promise<ConfessionChannel>

  getConfessionChannel(guildId: string): Promise<ConfessionChannel | null>

  saveConfession(data: {
    messageId: string
    channelId: string
    guildId: string
    title: string
    content: string
  }): Promise<Confession>

  getConfession(messageId: string): Promise<Confession | null>

  deleteConfession(messageId: string): Promise<void>

  getConfessionStats(guildId: string): Promise<{
    total: number
    today: number
    channelId?: string
  }>
}
