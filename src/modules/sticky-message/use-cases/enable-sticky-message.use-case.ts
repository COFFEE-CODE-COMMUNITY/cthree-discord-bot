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
import { STICKY_MESSAGE_CREATE } from "../constants/custom-id.constants"

@Injectable()
export class EnableStickyMessageUseCase {
  public constructor(@Inject(STICKY_MESSAGE_SERVICE) private readonly stickyMessageService: StickyMessageService) {}

  public async execute(interaction: ChatInputCommandInteraction, options: EnableStickyMessageDto): Promise<void> {
    const userId = interaction.user.id
    const channelId = options.channel || interaction.channelId

    this.stickyMessageService.setTemporaryUser(userId, { channelId })

    const messageInput = new TextInputBuilder()
      .setCustomId(STICKY_MESSAGE_CREATE.input.message)
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(1)

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput)

    const modal = new ModalBuilder()
      .setCustomId(STICKY_MESSAGE_CREATE.id)
      .setTitle("Enable Sticky")
      .addComponents(actionRow)

    await interaction.showModal(modal)
  }
}
