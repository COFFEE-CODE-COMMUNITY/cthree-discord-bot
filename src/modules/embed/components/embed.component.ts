import { Injectable } from "@nestjs/common"
import { Button, ButtonContext, ComponentParam, Context, Modal, ModalContext, ModalParam } from "necord"
import { OnEditBasicInformationButtonClickedUseCase } from "../use-cases/on-edit-basic-information-button-clicked.use-case"
import { EditBasicInformationUseCase } from "../use-cases/edit-basic-information.use-case"
import { OnEditAuthorButtonClickedUseCase } from "../use-cases/on-edit-author-button-clicked.use-case"
import { EditAuthorUseCase } from "../use-cases/edit-author.use-case"
import { OnEditImagesButtonClickedUseCase } from "../use-cases/on-edit-images-button-clicked.use-case"
import { EditImagesUseCase } from "../use-cases/edit-images.use-case"
import { OnEditFooterButtonClickedUseCase } from "../use-cases/on-edit-footer-button-clicked.use-case"
import { EditFooterUseCase } from "../use-cases/edit-footer.use-case"

@Injectable()
export class EmbedComponent {
  public constructor(
    private readonly onEditBasicInformationButtonClickedUseCase: OnEditBasicInformationButtonClickedUseCase,
    private readonly editBasicInformationUseCase: EditBasicInformationUseCase,
    private readonly onEditAuthorButtonClickedUseCase: OnEditAuthorButtonClickedUseCase,
    private readonly editAuthorUseCase: EditAuthorUseCase,
    private readonly onEditImagesButtonClickedUseCase: OnEditImagesButtonClickedUseCase,
    private readonly editImagesUseCase: EditImagesUseCase,
    private readonly onEditFooterButtonClickedUseCase: OnEditFooterButtonClickedUseCase,
    private readonly editFooterUseCase: EditFooterUseCase,
  ) {}

  @Button("edit-embed-basic-information/:embedId")
  public async onEditBasicInformationButtonClick(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("embedId") embedId: string,
  ): Promise<void> {
    await this.onEditBasicInformationButtonClickedUseCase.execute(interaction, embedId)
  }

  @Modal("basic-information-modal/:embedId/:messageId")
  public async onBasicInformationModalSubmit(
    @Context() [interaction]: ModalContext,
    @ModalParam("embedId") embedId: string,
    @ModalParam("messageId") messageId: string,
  ): Promise<void> {
    await this.editBasicInformationUseCase.execute(interaction, embedId, messageId)
  }

  @Button("edit-embed-author/:embedId")
  public async onEditAuthorButtonClick(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("embedId") embedId: string,
  ): Promise<void> {
    await this.onEditAuthorButtonClickedUseCase.execute(interaction, embedId)
  }

  @Modal("author-modal/:embedId/:messageId")
  public async onAuthorModalSubmit(
    @Context() [interaction]: ModalContext,
    @ModalParam("embedId") embedId: string,
    @ModalParam("messageId") messageId: string,
  ): Promise<void> {
    await this.editAuthorUseCase.execute(interaction, embedId, messageId)
  }

  @Button("edit-embed-images/:embedId")
  public async onEditImagesButtonClick(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("embedId") embedId: string,
  ): Promise<void> {
    await this.onEditImagesButtonClickedUseCase.execute(interaction, embedId)
  }

  @Modal("images-modal/:embedId/:messageId")
  public async onImagesModalSubmit(
    @Context() [interaction]: ModalContext,
    @ModalParam("embedId") embedId: string,
    @ModalParam("messageId") messageId: string,
  ): Promise<void> {
    await this.editImagesUseCase.execute(interaction, embedId, messageId)
  }

  @Button("edit-embed-footer/:embedId")
  public async onEditFooterButtonClick(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("embedId") embedId: string,
  ): Promise<void> {
    await this.onEditFooterButtonClickedUseCase.execute(interaction, embedId)
  }

  @Modal("footer-modal/:embedId/:messageId")
  public async onFooterModalSubmit(
    @Context() [interaction]: ModalContext,
    @ModalParam("embedId") embedId: string,
    @ModalParam("messageId") messageId: string,
  ): Promise<void> {
    await this.editFooterUseCase.execute(interaction, embedId, messageId)
  }
}
