export class CreateTakeRoleDto {
  public guildId!: string
  public userId!: string
  public channelId!: string
  public roleIds!: string[]
  public message?: string | null
  public embedTitle!: string
  public embedBody!: string
  public embedColor!: string
  public imageUrl?: string | null
}
