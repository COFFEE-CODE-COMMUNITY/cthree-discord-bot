import { ChannelOption } from "necord"
import { ChannelType } from "discord.js"

export class EnableAutoDeleteMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for enable auto-delete message.",
    channel_types: [ChannelType.GuildText],
    required: false,
  })
  public channel?: string
}
