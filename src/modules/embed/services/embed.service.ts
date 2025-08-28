import { Injectable } from "@nestjs/common"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, Message } from "discord.js"
import { Embed } from "../entities/embed.entity"

@Injectable()
export class EmbedService {
  public getEmbedButtonsEditor(embed: Embed): ButtonBuilder[] {
    const basicInformationButton = new ButtonBuilder()
      .setCustomId(`edit-embed-basic-information/${embed.id}`)
      .setLabel("Edit Basic Information")
      .setStyle(ButtonStyle.Secondary)

    const authorButton = new ButtonBuilder()
      .setCustomId(`edit-embed-author/${embed.id}`)
      .setLabel("Edit Author")
      .setStyle(ButtonStyle.Secondary)

    const imagesButton = new ButtonBuilder()
      .setCustomId(`edit-embed-images/${embed.id}`)
      .setLabel("Edit Images")
      .setStyle(ButtonStyle.Secondary)

    const footerButton = new ButtonBuilder()
      .setCustomId(`edit-embed-footer/${embed.id}`)
      .setLabel("Edit Footer")
      .setStyle(ButtonStyle.Secondary)

    return [basicInformationButton, authorButton, imagesButton, footerButton]
  }

  public getEmbedViewer(embed: Embed): EmbedBuilder {
    const embedBuilder = new EmbedBuilder()
      .setTitle(embed.title || null)
      .setDescription(embed.description || null)
      .setColor((embed.hexColor as ColorResolvable) || null)
      .setImage(embed.mainImageUrl || null)
      .setThumbnail(embed.thumbnailImageUrl || null)

    if (embed.author) {
      embedBuilder.setAuthor({ name: embed.author, iconURL: embed.authorIconUrl })
    }

    if (embed.footerText) {
      embedBuilder.setFooter({ text: embed.footerText, iconURL: embed.footerIconUrl })
    }

    if (embed.footerTimestamp) {
      embedBuilder.setTimestamp(new Date())
    }

    return embedBuilder
  }

  public async editEmbedEditorMessage(message: Message<boolean>, embed: Embed): Promise<void> {
    const embedViewer = this.getEmbedViewer(embed)
    const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(this.getEmbedButtonsEditor(embed))

    await message.edit({
      embeds: [embedViewer],
      components: [buttonsRow],
    })
  }

  // public getBasicInformationModal()
}
