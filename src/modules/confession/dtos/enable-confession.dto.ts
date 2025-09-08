import { ChannelOption } from "necord"
import { ChannelType, GuildChannel } from "discord.js"

export class EnableConfessionDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for enable confession.",
    channel_types: [ChannelType.GuildText],
    required: true,
  })
  public channel?: GuildChannel
}
