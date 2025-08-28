import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../common/base/base.repository"
import { Embed } from "../entities/embed.entity"
import { DataSource } from "typeorm"

@Injectable()
export class EmbedRepository extends BaseRepository<Embed> {
  public constructor(dataSource: DataSource) {
    super(dataSource, Embed)
  }

  public async findByGuildId(guildId: string): Promise<Embed[]> {
    return await this.getRepository().findBy({ guildId })
  }

  public async findByNameAndGuildId(name: string, guildId: string): Promise<Embed | null> {
    return await this.getRepository().findOneBy({ name, guildId })
  }

  public async existsByNameAndGuildId(name: string, guildId: string): Promise<boolean> {
    return await this.getRepository().existsBy({ name, guildId })
  }
}
