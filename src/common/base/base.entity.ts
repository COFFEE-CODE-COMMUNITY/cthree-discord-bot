import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export type EntityId = string

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: EntityId

  @CreateDateColumn()
  public createdAt!: Date

  @UpdateDateColumn()
  public updatedAt!: Date
}
