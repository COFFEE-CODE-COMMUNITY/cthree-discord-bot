import { Injectable } from "@nestjs/common"
import { IConfessionService } from "./confession.service"
import { ConfessionRepository } from "../repositories/confession.repository"
import { ConfessionChannelRepository } from "../repositories/confession-channel.repository"
import { Confession } from "../entities/confession.entity"
import { ConfessionChannel } from "../entities/confession-channel.entity"

@Injectable()
export class ConfessionServiceImpl implements IConfessionService {
  public constructor(
    private readonly confessionChannelRepo: ConfessionChannelRepository,
    private readonly confessionRepo: ConfessionRepository,
  ) {}

  public async setConfessionChannel(
    guildId: string,
    channelId: string,
    messageId?: string,
  ): Promise<ConfessionChannel> {
    let config = await this.confessionChannelRepo.findByGuildId(guildId)

    if (!config) {
      config = this.confessionChannelRepo.create({ guildId })
    }

    config.channelId = channelId
    config.messageId = messageId
    config.isActive = true
    config.updatedAt = new Date()

    return this.confessionChannelRepo.save(config)
  }

  public getConfessionChannel(guildId: string): Promise<ConfessionChannel | null> {
    return this.confessionChannelRepo.findActive(guildId)
  }

  public async saveConfession(data: {
    messageId: string
    channelId: string
    guildId: string
    title: string
    content: string
  }): Promise<Confession> {
    const confession = this.confessionRepo.create({ ...data, isActive: true })
    return this.confessionRepo.save(confession)
  }

  public getConfession(messageId: string): Promise<Confession | null> {
    return this.confessionRepo.findActiveByMessageId(messageId)
  }

  public async deleteConfession(messageId: string): Promise<void> {
    await this.confessionRepo.disable(messageId)
  }

  public async getConfessionStats(guildId: string): Promise<{ total: number; today: number; channelId?: string }> {
    const channelConfig = await this.getConfessionChannel(guildId)
    if (!channelConfig) return { total: 0, today: 0 }

    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const { total, today: todayCount } = await this.confessionRepo.countStats(channelConfig.channelId, today)

    return { total, today: todayCount, channelId: channelConfig.channelId }
  }
}
