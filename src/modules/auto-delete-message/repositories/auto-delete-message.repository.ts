import { BaseRepository } from "../../../common/base/base.repository"
import { AutoDeleteMessage } from "../entities/auto-delete-message.entity"
import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

@Injectable()
export class AutoDeleteMessageRepository extends BaseRepository<AutoDeleteMessage> {
  public constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource, AutoDeleteMessage)
  }

  public async existsByChannelId(channelId: string): Promise<boolean> {
    return this.getRepository().existsBy({
      channelId,
    })
  }

  public async deleteByChannelId(channelId: string): Promise<void> {
    await this.getRepository().delete({
      channelId,
    })
  }

  public async deleteByGuildId(guildId: string): Promise<void> {
    await this.getRepository().delete({
      guildId,
    })
  }
}
