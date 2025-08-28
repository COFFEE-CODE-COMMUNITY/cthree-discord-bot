import { Test, TestingModule } from "@nestjs/testing"
import { EmbedComponent } from "./embed.component"
import { OnEditBasicInformationButtonClickedUseCase } from "../use-cases/on-edit-basic-information-button-clicked.use-case"
import { EditBasicInformationUseCase } from "../use-cases/edit-basic-information.use-case"
import { OnEditAuthorButtonClickedUseCase } from "../use-cases/on-edit-author-button-clicked.use-case"
import { EditAuthorUseCase } from "../use-cases/edit-author.use-case"
import { OnEditImagesButtonClickedUseCase } from "../use-cases/on-edit-images-button-clicked.use-case"
import { EditImagesUseCase } from "../use-cases/edit-images.use-case"
import { OnEditFooterButtonClickedUseCase } from "../use-cases/on-edit-footer-button-clicked.use-case"
import { EditFooterUseCase } from "../use-cases/edit-footer.use-case"
import { ButtonInteraction, ModalSubmitInteraction } from "discord.js"

describe("EmbedComponent", () => {
  let component: EmbedComponent

  let onEditBasicInformation: OnEditBasicInformationButtonClickedUseCase
  let editBasicInformation: EditBasicInformationUseCase
  let onEditAuthor: OnEditAuthorButtonClickedUseCase
  let editAuthor: EditAuthorUseCase
  let onEditImages: OnEditImagesButtonClickedUseCase
  let editImages: EditImagesUseCase
  let onEditFooter: OnEditFooterButtonClickedUseCase
  let editFooter: EditFooterUseCase

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbedComponent,
        { provide: OnEditBasicInformationButtonClickedUseCase, useValue: { execute: jest.fn() } },
        { provide: EditBasicInformationUseCase, useValue: { execute: jest.fn() } },
        { provide: OnEditAuthorButtonClickedUseCase, useValue: { execute: jest.fn() } },
        { provide: EditAuthorUseCase, useValue: { execute: jest.fn() } },
        { provide: OnEditImagesButtonClickedUseCase, useValue: { execute: jest.fn() } },
        { provide: EditImagesUseCase, useValue: { execute: jest.fn() } },
        { provide: OnEditFooterButtonClickedUseCase, useValue: { execute: jest.fn() } },
        { provide: EditFooterUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    component = module.get(EmbedComponent)
    onEditBasicInformation = module.get(OnEditBasicInformationButtonClickedUseCase)
    editBasicInformation = module.get(EditBasicInformationUseCase)
    onEditAuthor = module.get(OnEditAuthorButtonClickedUseCase)
    editAuthor = module.get(EditAuthorUseCase)
    onEditImages = module.get(OnEditImagesButtonClickedUseCase)
    editImages = module.get(EditImagesUseCase)
    onEditFooter = module.get(OnEditFooterButtonClickedUseCase)
    editFooter = module.get(EditFooterUseCase)
  })

  it("should handle basic information button click", async (): Promise<void> => {
    const interaction = {} as ButtonInteraction
    const embedId = "abc123"

    await component.onEditBasicInformationButtonClick([interaction], embedId)

    expect(onEditBasicInformation.execute).toHaveBeenCalledWith(interaction, embedId)
  })

  it("should handle basic information modal submit", async (): Promise<void> => {
    const interaction = {} as ModalSubmitInteraction
    const embedId = "abc123"
    const messageId = "msg123"

    await component.onBasicInformationModalSubmit([interaction], embedId, messageId)

    expect(editBasicInformation.execute).toHaveBeenCalledWith(interaction, embedId, messageId)
  })

  it("should handle author button click", async (): Promise<void> => {
    const interaction = {} as ButtonInteraction
    const embedId = "def456"

    await component.onEditAuthorButtonClick([interaction], embedId)

    expect(onEditAuthor.execute).toHaveBeenCalledWith(interaction, embedId)
  })

  it("should handle author modal submit", async (): Promise<void> => {
    const interaction = {} as ModalSubmitInteraction
    const embedId = "def456"
    const messageId = "msg456"

    await component.onAuthorModalSubmit([interaction], embedId, messageId)

    expect(editAuthor.execute).toHaveBeenCalledWith(interaction, embedId, messageId)
  })

  it("should handle images button click", async (): Promise<void> => {
    const interaction = {} as ButtonInteraction
    const embedId = "img789"

    await component.onEditImagesButtonClick([interaction], embedId)

    expect(onEditImages.execute).toHaveBeenCalledWith(interaction, embedId)
  })

  it("should handle images modal submit", async (): Promise<void> => {
    const interaction = {} as ModalSubmitInteraction
    const embedId = "img789"
    const messageId = "msg789"

    await component.onImagesModalSubmit([interaction], embedId, messageId)

    expect(editImages.execute).toHaveBeenCalledWith(interaction, embedId, messageId)
  })

  it("should handle footer button click", async (): Promise<void> => {
    const interaction = {} as ButtonInteraction
    const embedId = "foot999"

    await component.onEditFooterButtonClick([interaction], embedId)

    expect(onEditFooter.execute).toHaveBeenCalledWith(interaction, embedId)
  })

  it("should handle footer modal submit", async (): Promise<void> => {
    const interaction = {} as ModalSubmitInteraction
    const embedId = "foot999"
    const messageId = "msg999"

    await component.onFooterModalSubmit([interaction], embedId, messageId)

    expect(editFooter.execute).toHaveBeenCalledWith(interaction, embedId, messageId)
  })
})
