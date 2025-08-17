import { ChannelOption } from "necord"
import { ChannelType, GuildChannel } from "discord.js"

export class DisableAutoDeleteMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for disable auto-delete message.",
    channel_types: [ChannelType.GuildText],
    required: false,
  })
  public channel?: GuildChannel
}
