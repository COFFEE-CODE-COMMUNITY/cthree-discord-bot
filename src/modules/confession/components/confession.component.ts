import { Context, Modal, ModalContext } from "necord"
import { Injectable } from "@nestjs/common"
import { CREATE_CONFESSION_MODAL } from "../constants/custom-id.constant"
import { CreateConfessionEmbedUseCase } from "../use-cases/create-confession-embed.use-case"

@Injectable()
export class ConfessionComponent {
  public constructor(private readonly createConfessionEmbedUseCase: CreateConfessionEmbedUseCase) {}

  @Modal(CREATE_CONFESSION_MODAL)
  public async handleModalSubmit(@Context() [interaction]: ModalContext): Promise<void> {
    console.log(interaction.customId)
    await this.createConfessionEmbedUseCase.execute(interaction)
  }
}
