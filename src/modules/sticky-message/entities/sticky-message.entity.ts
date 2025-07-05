import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity()
export class StickyMessage extends BaseEntity {
  @Column()
  public message!: string

  @Column({ unique: true })
  public messageId!: string

  @Column({ unique: true })
  public channelId!: string

  @Column()
  public guildId!: string
}
