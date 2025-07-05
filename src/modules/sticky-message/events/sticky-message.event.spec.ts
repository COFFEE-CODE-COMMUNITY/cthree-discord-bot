import { Test, TestingModule } from "@nestjs/testing"
import { StickyMessageEvent } from "./sticky-message.event"
import { MoveStickyMessageToRecentUseCase } from "../use-cases/move-sticky-message-to-recent.use-case"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { ContextOf } from "necord"
import { Message } from "discord.js"

describe("StickyMessageEvent", () => {
  let event: StickyMessageEvent
  let moveStickyMessageToRecentUseCase: DeepMockProxy<MoveStickyMessageToRecentUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickyMessageEvent,
        {
          provide: MoveStickyMessageToRecentUseCase,
          useValue: mockDeep<MoveStickyMessageToRecentUseCase>(),
        },
      ],
    }).compile()

    event = module.get<StickyMessageEvent>(StickyMessageEvent)
    moveStickyMessageToRecentUseCase = module.get(MoveStickyMessageToRecentUseCase)
  })

  it("should be defined", () => {
    expect(event).toBeDefined()
  })

  describe("onMessageCreate", () => {
    it("should call moveStickyMessageToRecentUseCase.execute with the message", async () => {
      const message = mockDeep<Message>()
      const context = [message] as ContextOf<"messageCreate">

      await event.onMessageCreate(context)

      expect(moveStickyMessageToRecentUseCase.execute).toHaveBeenCalledWith(message)
    })
  })
})
