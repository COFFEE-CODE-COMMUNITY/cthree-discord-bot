import { Injectable } from "@nestjs/common"
import { Context, Modal, ModalContext } from "necord"
import { STICKY_MESSAGE_CREATE } from "../constants/custom-id.constants"
import { CreateStickyMessageUseCase } from "../use-cases/create-sticky-message.use-case"

@Injectable()
export class StickyMessageComponent {
  public constructor(private readonly createStickyMessageUseCase: CreateStickyMessageUseCase) {}

  @Modal(STICKY_MESSAGE_CREATE.id)
  public async createStickyMessageModal(@Context() [interaction]: ModalContext): Promise<void> {
    await this.createStickyMessageUseCase.execute(interaction)
  }
}
