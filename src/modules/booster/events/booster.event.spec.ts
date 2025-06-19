import { Test, TestingModule } from "@nestjs/testing"
import { BoosterEvent } from "./booster.event"
import { HandleBoosterMessageUseCase } from "../use-cases/handle-booster-message.use-case"
import { Message } from "discord.js"

describe("BoosterEvent", () => {
  let boosterEvent: BoosterEvent
  let handleBoosterMessageUseCase: HandleBoosterMessageUseCase

  beforeEach(async () => {
    const mockHandleBoosterMessageUseCase = {
      execute: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoosterEvent,
        {
          provide: HandleBoosterMessageUseCase,
          useValue: mockHandleBoosterMessageUseCase,
        },
      ],
    }).compile()

    boosterEvent = module.get<BoosterEvent>(BoosterEvent)
    handleBoosterMessageUseCase = module.get<HandleBoosterMessageUseCase>(HandleBoosterMessageUseCase)
  })

  it("should be defined", () => {
    expect(boosterEvent).toBeDefined()
  })

  describe("onMessageCreate", () => {
    it("should call handleBoosterMessageUseCase.execute with the message", async () => {
      const mockMessage = {
        id: "1234567890",
        content: "Ini pesan uji coba",
        guild: {},
        member: {},
        channelId: "some-channel-id",
        author: { bot: false },
      } as unknown as Message<true>

      await boosterEvent.onMessageCreate([mockMessage])

      expect(handleBoosterMessageUseCase.execute).toHaveBeenCalledTimes(1)
      expect(handleBoosterMessageUseCase.execute).toHaveBeenCalledWith(mockMessage)
    })
  })
})
