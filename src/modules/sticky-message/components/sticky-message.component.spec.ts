import { Test, TestingModule } from "@nestjs/testing"
import { StickyMessageComponent } from "./sticky-message.component"
import { CreateStickyMessageUseCase } from "../use-cases/create-sticky-message.use-case"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { ModalContext } from "necord"
import { ModalSubmitInteraction } from "discord.js"

describe("StickyMessageComponent", () => {
  let component: StickyMessageComponent
  let createStickyMessageUseCase: DeepMockProxy<CreateStickyMessageUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickyMessageComponent,
        {
          provide: CreateStickyMessageUseCase,
          useValue: mockDeep<CreateStickyMessageUseCase>(),
        },
      ],
    }).compile()

    component = module.get<StickyMessageComponent>(StickyMessageComponent)
    createStickyMessageUseCase = module.get(CreateStickyMessageUseCase)
  })

  it("should be defined", () => {
    expect(component).toBeDefined()
  })

  describe("createStickyMessageModal", () => {
    it("should call createStickyMessageUseCase.execute with the interaction", async () => {
      const interaction = mockDeep<ModalSubmitInteraction>()
      const context: ModalContext = [interaction]

      await component.createStickyMessageModal(context)

      expect(createStickyMessageUseCase.execute).toHaveBeenCalledWith(interaction)
    })
  })
})
