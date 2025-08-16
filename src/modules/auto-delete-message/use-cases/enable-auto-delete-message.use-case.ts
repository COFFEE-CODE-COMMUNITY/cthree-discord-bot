import { ChatInputCommandInteraction } from "discord.js"
import { EnableAutoDeleteMessageDto } from "../dtos/enable-auto-delete-message.dto"
import { Injectable } from "@nestjs/common"

@Injectable()
export class EnableAutoDeleteMessageUseCase {
  public async execute(_interaction: ChatInputCommandInteraction, _options: EnableAutoDeleteMessageDto): Promise<void> {
    // TODO: Implement the logic to enable auto-delete messages
  }
}
