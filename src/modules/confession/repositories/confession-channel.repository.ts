import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ConfessionChannel } from "../entities/confession-channel.entity"

@Injectable()
export class ConfessionChannelRepository {
  public constructor(
    @InjectRepository(ConfessionChannel)
    private readonly repo: Repository<ConfessionChannel>,
  ) {}

  public findByGuildId(guildId: string): Promise<ConfessionChannel | null> {
    return this.repo.findOne({ where: { guildId } })
  }

  public findActive(guildId: string): Promise<ConfessionChannel | null> {
    return this.repo.findOne({ where: { guildId, isActive: true } })
  }

  public save(channel: ConfessionChannel): Promise<ConfessionChannel> {
    return this.repo.save(channel)
  }

  public create(data: Partial<ConfessionChannel>): ConfessionChannel {
    return this.repo.create(data)
  }
}
