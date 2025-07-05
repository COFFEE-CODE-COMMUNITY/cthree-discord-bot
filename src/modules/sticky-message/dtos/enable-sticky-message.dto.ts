import { ChannelOption } from "necord"

export class EnableStickyMessageDto {
  @ChannelOption({
    name: "channel",
    description: "Specify the channel for enable sticky message.",
  })
  public channel?: string
}
