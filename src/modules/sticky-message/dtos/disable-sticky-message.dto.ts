import { ChannelOption } from "necord"
import { ChannelType } from "discord.js"

export class DisableStickyMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for disable sticky message.",
    channel_types: [ChannelType.GuildText],
    required: false,
  })
  public channel?: string
}
