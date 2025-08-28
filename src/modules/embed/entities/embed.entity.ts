import { BaseEntity } from "../../../common/base/base.entity"
import { Column, Entity } from "typeorm"

@Entity("embeds")
export class Embed extends BaseEntity {
  @Column()
  public name!: string

  @Column()
  public guildId!: string

  @Column({ nullable: true })
  public title?: string

  @Column({ nullable: true })
  public description?: string

  @Column({ nullable: true })
  public hexColor?: string

  @Column({ nullable: true })
  public author?: string

  @Column({ nullable: true })
  public authorIconUrl?: string

  @Column({ nullable: true })
  public mainImageUrl?: string

  @Column({ nullable: true })
  public thumbnailImageUrl?: string

  @Column({ nullable: true })
  public footerText?: string

  @Column({ nullable: true })
  public footerIconUrl?: string

  @Column({ default: false })
  public footerTimestamp?: boolean
}
