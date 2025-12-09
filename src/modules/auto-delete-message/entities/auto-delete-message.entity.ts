import { Entity, Column } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity()
export class AutoDeleteMessage extends BaseEntity {
  @Column({ unique: true })
  public channelId!: string

  @Column()
  public guildId!: string
}
