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
    it("should set temporary user data and show a modal to input the sticky message using channel option", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()
      interactionMock.user = { id: "user-123" } as any
      interactionMock.channelId = "interaction-channel-789"

      const mockChannel = { id: "channel-456" }
      const options: EnableStickyMessageDto = {
        channel: mockChannel as any,
      }

      await useCase.execute(interactionMock, options)

      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledWith("user-123", {
        channelId: "channel-456",
      })
      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledTimes(1)
      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)
    })

    it("should use interaction channelId when no channel option provided", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()
      interactionMock.user = { id: "user-123" } as any
      interactionMock.channelId = "interaction-channel-789"

      const options: EnableStickyMessageDto = {}

      await useCase.execute(interactionMock, options)

      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledWith("user-123", {
        channelId: "interaction-channel-789",
      })
      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledTimes(1)
      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)
    })

    it("should use interaction channelId when channel option has no id property", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()
      interactionMock.user = { id: "user-123" } as any
      interactionMock.channelId = "interaction-channel-789"

      const mockChannel = {}
      const options: EnableStickyMessageDto = {
        channel: mockChannel as any,
      }

      await useCase.execute(interactionMock, options)

      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledWith("user-123", {
        channelId: "interaction-channel-789",
      })
      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledTimes(1)
      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)
    })

    it("should use interaction channelId when channel option is null", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()
      interactionMock.user = { id: "user-123" } as any
      interactionMock.channelId = "interaction-channel-789"

      const options: EnableStickyMessageDto = {
        channel: null as any,
      }

      await useCase.execute(interactionMock, options)

      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledWith("user-123", {
        channelId: "interaction-channel-789",
      })
      expect(stickyMessageServiceMock.setTemporaryUser).toHaveBeenCalledTimes(1)
      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)
    })

    it("should create and show modal", async () => {
      const interactionMock = mockDeep<ChatInputCommandInteraction>()
      interactionMock.user = { id: "user-123" } as any
      interactionMock.channelId = "interaction-channel-789"

      const options: EnableStickyMessageDto = {}

      await useCase.execute(interactionMock, options)

      expect(interactionMock.showModal).toHaveBeenCalledTimes(1)

      // Verify that a modal was called with some object
      const modalCall = interactionMock.showModal.mock.calls[0][0]
      expect(modalCall).toBeDefined()
      expect(typeof modalCall).toBe("object")
    })
  })
})
