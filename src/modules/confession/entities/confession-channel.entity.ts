import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("confession_channels")
@Index("IDX_confession_channels_guild_id", ["guildId"])
export class ConfessionChannel {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: "guild_id", type: "varchar", length: 20, unique: true })
  public guildId!: string

  @Column({ name: "channel_id", type: "varchar", length: 20 })
  public channelId!: string

  @Column({ name: "message_id", type: "varchar", length: 20, nullable: true })
  public messageId?: string

  @Column({ name: "is_active", type: "boolean", default: true })
  public isActive!: boolean

  @CreateDateColumn({ name: "created_at" })
  public createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt!: Date
}
