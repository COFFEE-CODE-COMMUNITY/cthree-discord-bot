import { Inject, Injectable } from "@nestjs/common"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { STICKY_MESSAGE_SERVICE, StickyMessageService } from "../services/sticky-message.service"
import {
  ChatInputCommandInteraction,
  TextInputBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
} from "discord.js"
import { STICKY_MESSAGE_CREATE_MODAL_ID } from "../constants/custom-id.constants"

@Injectable()
export class EnableStickyMessageUseCase {
  public constructor(@Inject(STICKY_MESSAGE_SERVICE) private readonly stickyMessageService: StickyMessageService) {}

  public async execute(interaction: ChatInputCommandInteraction, options: EnableStickyMessageDto): Promise<void> {
    const userId = interaction.user.id

    this.stickyMessageService.setTemporaryUser(userId, { channelId: options.channel })

    const messageInput = new TextInputBuilder()
      .setCustomId("sticky-message")
      .setLabel("Sticky Message")
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(1)

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput)

    const modal = new ModalBuilder()
      .setCustomId(STICKY_MESSAGE_CREATE_MODAL_ID)
      .setTitle("Enable Sticky")
      .addComponents(actionRow)

    await interaction.showModal(modal)
  }
}
