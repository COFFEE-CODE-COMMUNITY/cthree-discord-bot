import { DataSource, Repository } from "typeorm"
import { BaseEntity, EntityId } from "./base.entity"

export abstract class BaseRepository<E extends BaseEntity> {
  protected constructor(
    protected readonly dataSource: DataSource,
    protected entity: new () => E,
  ) {}

  protected getRepository(): Repository<E> {
    return this.dataSource.getRepository<E>(this.entity)
  }

  public count(): Promise<number> {
    return this.getRepository().count()
  }

  public async delete(id: EntityId): Promise<void> {
    await this.getRepository().delete(id as any)
  }

  public async deleteAll(): Promise<void> {
    await this.getRepository().clear()
  }

  public existsById(id: EntityId): Promise<boolean> {
    return this.getRepository().exists({ where: { id: id as any } })
  }

  public findAll(): Promise<E[]> {
    return this.getRepository().find()
  }

  public findById(id: EntityId): Promise<E | null> {
    return this.getRepository().findOne({ where: { id: id as any } })
  }

  public async insert(entity: E): Promise<void> {
    await this.getRepository().insert(entity as any)
  }

  public async insertMany(entities: E[]): Promise<void> {
    await this.getRepository().insert(entities as any[])
  }

  public save(entity: E): Promise<E> {
    return this.getRepository().save(entity)
  }

  public async update(id: EntityId, entity: E): Promise<void> {
    await this.getRepository().update(id as any, entity as any)
  }
}
