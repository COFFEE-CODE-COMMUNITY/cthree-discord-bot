import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity("confessions")
@Index("IDX_confessions_message_id", ["messageId"])
@Index("IDX_confessions_channel_id", ["channelId"])
export class Confession {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: "message_id", type: "varchar", length: 20, unique: true })
  public messageId!: string

  @Column({ name: "channel_id", type: "varchar", length: 20 })
  public channelId!: string

  @Column({ name: "guild_id", type: "varchar", length: 20 })
  public guildId!: string

  @Column({ name: "title", type: "varchar", length: 100, nullable: true })
  public title?: string

  @Column({ name: "content", type: "text" })
  public content!: string

  @Column({ name: "is_active", type: "boolean", default: true })
  public isActive!: boolean

  @CreateDateColumn({ name: "created_at" })
  public createdAt!: Date
}
