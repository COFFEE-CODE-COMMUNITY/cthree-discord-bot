import { ChannelOption } from "necord"
import { ChannelType, GuildChannel } from "discord.js"

export class DisableStickyMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for disable sticky message.",
    channel_types: [ChannelType.GuildText],
    required: false,
  })
  public channel?: GuildChannel
}
