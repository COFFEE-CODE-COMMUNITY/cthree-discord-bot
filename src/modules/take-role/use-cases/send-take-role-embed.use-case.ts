import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
  TextChannel,
} from "discord.js"
import { Inject, Injectable } from "@nestjs/common"
import { ITakeRoleService, TAKE_ROLE_SERVICE } from "../services/take-role.service"

@Injectable()
export class SendTakeRoleEmbedUseCase {
  public constructor(@Inject(TAKE_ROLE_SERVICE) private readonly takeRoleService: ITakeRoleService) {}

  public async execute(takeRoleId: string, guild: any): Promise<void> {
    const data = await this.takeRoleService.findById(takeRoleId)

    if (!data) throw new Error("Take-role data not found")

    const channel = guild.channels.cache.get(data.channelId)

    if (!channel || channel.type !== ChannelType.GuildText || typeof (channel as TextChannel).send !== "function") {
      throw new Error("Channel not found")
    }

    const embed = new EmbedBuilder()
      .setTitle(data.embedTitle)
      .setDescription(data.embedBody)
      .setColor((data.embedColor as ColorResolvable) || "#2f3136")

    if (data.imageUrl) embed.setImage(data.imageUrl)

    const styleMap = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger]

    const buttons = data.roleIds.map((roleId, index) => {
      const role = guild.roles.cache.get(roleId)
      const roleName = role?.name || `Role ${index + 1}`

      return new ButtonBuilder()
        .setCustomId(`takeRoleBtn:${data.id}:${roleId}`)
        .setLabel(roleName)
        .setStyle(styleMap[index % styleMap.length])
    })

    const rows: Array<ActionRowBuilder<ButtonBuilder>> = []
    for (let i = 0; i < buttons.length; i += 5) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons.slice(i, i + 5))
      rows.push(row)
    }

    await channel.send({
      content: data.message || "",
      embeds: [embed],
      components: rows,
    })
  }
}
