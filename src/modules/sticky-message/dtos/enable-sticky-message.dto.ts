import { ChannelOption } from "necord"
import { ChannelType } from "discord.js"

export class EnableStickyMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for enable sticky message.",
    channel_types: [ChannelType.GuildText],
    required: false,
  })
  public channel?: string
}
