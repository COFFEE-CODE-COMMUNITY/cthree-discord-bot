import { Test, TestingModule } from "@nestjs/testing"
import { mock, DeepMockProxy, mockDeep } from "jest-mock-extended"
import { EnableStickyMessageUseCase } from "./enable-sticky-message.use-case"
import { STICKY_MESSAGE_SERVICE, StickyMessageService } from "../services/sticky-message.service"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { ChatInputCommandInteraction } from "discord.js"

describe("EnableStickyMessageUseCase", () => {
  let useCase: EnableStickyMessageUseCase
  let stickyMessageServiceMock: DeepMockProxy<StickyMessageService>

  beforeEach(async () => {
    stickyMessageServiceMock = mock<StickyMessageService>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnableStickyMessageUseCase,
        {
          provide: STICKY_MESSAGE_SERVICE,
          useValue: stickyMessageServiceMock,
        },
      ],
    }).compile()

    useCase = module.get<EnableStickyMessageUseCase>(EnableStickyMessageUseCase)
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    it("should set temporary user data and show a modal to input the sticky message", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()

      interactionMock.user = { id: "user-123" } as any

      const options: EnableStickyMessageDto = {
        channel: "channel-456",
      }

      await useCase.execute(interactionMock, options)

      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledWith("user-123", {
        channelId: "channel-456",
      })
      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledTimes(1)

      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)
    })
  })
})
