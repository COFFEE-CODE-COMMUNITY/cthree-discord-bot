import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Between, Repository, UpdateResult } from "typeorm"
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
    const total = await this.repo.count({ where: { channelId } })

    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    const todayCount = await this.repo.count({
      where: {
        channelId,
        createdAt: Between(startOfDay, endOfDay),
      },
    })

    return { total, today: todayCount }
  }
}
