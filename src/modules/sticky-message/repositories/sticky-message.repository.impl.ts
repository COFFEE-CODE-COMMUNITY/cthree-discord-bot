import { StickyMessageRepository } from "./sticky-message.repository"
import { StickyMessage } from "../entities/sticky-message.entity"
import { Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class StickyMessageRepositoryImpl implements StickyMessageRepository {
  public constructor(
    @InjectRepository(StickyMessage)
    private readonly repository: Repository<StickyMessage>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  public async create(entity: StickyMessage): Promise<StickyMessage> {
    return await this.repository.save(entity)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  public async deleteByChannelId(channelId: string): Promise<void> {
    await this.repository.delete({ channelId })
  }

  public async deleteByGuildId(guildId: string): Promise<void> {
    await this.repository.delete({ guildId })
  }

  public async findAll(): Promise<StickyMessage[]> {
    return await this.repository.find()
  }

  public async findById(id: string): Promise<StickyMessage | null> {
    return await this.repository.findOne({ where: { id } })
  }

  public findByChannelId(channelId: string): Promise<StickyMessage | null> {
    return this.repository.findOne({ where: { channelId } })
  }

  public async update(id: string, entity: StickyMessage): Promise<StickyMessage> {
    await this.repository.update(id, entity)

    const updatedEntity = await this.repository.findOne({ where: { id } })

    if (!updatedEntity) {
      this.logger.error(`StickyMessage with id ${id} not found during update.`)

      throw new Error(`StickyMessage with id ${id} not found.`)
    }

    return updatedEntity
  }

  public async updateByChannelId(channelId: string, stickyMessage: StickyMessage): Promise<StickyMessage> {
    await this.repository.update({ channelId }, stickyMessage)

    const updatedEntity = await this.repository.findOne({ where: { channelId } })

    if (!updatedEntity) {
      this.logger.error(`StickyMessage with channelId ${channelId} not found during update.`)

      throw new Error(`StickyMessage with channelId ${channelId} not found.`)
    }

    return updatedEntity
  }
}
