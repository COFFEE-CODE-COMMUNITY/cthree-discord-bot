import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, UpdateResult } from "typeorm"
import { Confession } from "../entities/confession.entity"

@Injectable()
export class ConfessionRepository {
  public constructor(@InjectRepository(Confession) private readonly repo: Repository<Confession>) {}

  public create(data: Partial<Confession>): Confession {
    return this.repo.create(data)
  }

  public save(confession: Confession): Promise<Confession> {
    return this.repo.save(confession)
  }

  public findActiveByMessageId(messageId: string): Promise<Confession | null> {
    return this.repo.findOne({ where: { messageId, isActive: true } })
  }

  public disable(messageId: string): Promise<UpdateResult> {
    return this.repo.update({ messageId }, { isActive: false })
  }

  public async countStats(channelId: string, today: Date): Promise<{ total: number; today: number }> {
    const [total, todayCount] = await Promise.all([
      this.repo.count({ where: { channelId, isActive: true } }),
      this.repo.count({ where: { channelId, isActive: true, createdAt: today as any } }),
    ])
    return { total, today: todayCount }
  }
}
