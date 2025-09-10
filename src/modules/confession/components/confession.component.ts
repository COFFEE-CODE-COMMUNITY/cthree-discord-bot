import { Button, ButtonContext, Context, Modal, ModalContext } from "necord"
import { Injectable } from "@nestjs/common"
import { CREATE_CONFESSION_BTN, CREATE_CONFESSION_MODAL, REPLY_CONFESSION_BTN } from "../constants/custom-id.constant"
import { ShowConfessionModalUseCase } from "../use-cases/show-confession-modal.use-case"
import { CreateConfessionEmbedUseCase } from "../use-cases/create-confession-embed.use-case"
import { CreateConfessionThreadUseCase } from "../use-cases/create-confession-thread.use-case"

@Injectable()
export class ConfessionComponent {
  public constructor(
    private readonly showConfessionModalUseCase: ShowConfessionModalUseCase,
    private readonly createConfessionEmbedUseCase: CreateConfessionEmbedUseCase,
    private readonly createConfessionThreadUseCase: CreateConfessionThreadUseCase,
  ) {}

  @Button(CREATE_CONFESSION_BTN)
  public async showConfessionModal(@Context() [interaction]: ButtonContext): Promise<void> {
    console.log("MAKE confession button clicked")
    await this.showConfessionModalUseCase.execute(interaction)
  }

  @Modal(CREATE_CONFESSION_MODAL)
  public async handleModalSubmit(@Context() [interaction]: ModalContext): Promise<void> {
    await this.createConfessionEmbedUseCase.execute(interaction)
  }

  @Button(REPLY_CONFESSION_BTN)
  public async replyConfessionMain(@Context() [interaction]: ButtonContext): Promise<void> {
    console.log("REPLY confession button clicked")
    await this.createConfessionThreadUseCase.execute(interaction)
  }
}
