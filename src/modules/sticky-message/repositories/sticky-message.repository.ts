import { StickyMessage } from "../entities/sticky-message.entity"
import { Inject, Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { BaseRepository } from "../../../common/base/base.repository"

@Injectable()
export class StickyMessageRepository extends BaseRepository<StickyMessage> {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(dataSource, StickyMessage)
  }

  public async deleteByChannelId(channelId: string): Promise<void> {
    await this.getRepository().delete({ channelId })
  }

  public async deleteByGuildId(guildId: string): Promise<void> {
    await this.getRepository().delete({ guildId })
  }

  public findByChannelId(channelId: string): Promise<StickyMessage | null> {
    return this.getRepository().findOne({ where: { channelId } })
  }

  public async updateByChannelId(channelId: string, stickyMessage: StickyMessage): Promise<StickyMessage> {
    await this.getRepository().update({ channelId }, stickyMessage)

    const updatedEntity = await this.getRepository().findOne({ where: { channelId } })

    if (!updatedEntity) {
      this.logger.error(`StickyMessage with channelId ${channelId} not found during update.`)

      throw new Error(`StickyMessage with channelId ${channelId} not found.`)
    }

    return updatedEntity
  }
}
