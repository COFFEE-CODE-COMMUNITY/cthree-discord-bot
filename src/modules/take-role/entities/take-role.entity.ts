import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity("take_roles")
export class TakeRole {
  @PrimaryGeneratedColumn("uuid")
  public id!: string

  @Column()
  public guildId!: string

  @Column()
  public userId!: string

  @Column()
  public channelId!: string

  @Column({ type: "jsonb" })
  public roleIds!: string[]

  @Column({ nullable: true })
  public message?: string

  @Column()
  public embedTitle!: string

  @Column()
  public embedBody!: string

  @Column()
  public embedColor!: string

  @Column({ nullable: true })
  public imageUrl?: string

  @CreateDateColumn()
  public createdAt!: Date
}
