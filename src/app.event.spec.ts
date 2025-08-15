import { Test, TestingModule } from "@nestjs/testing"
import { AppEvent } from "./app.event"
import { Logger, LOGGER } from "./common/interfaces/logger/logger.interface"
import { mock, MockProxy } from "jest-mock-extended"
import { Client } from "discord.js"

describe("AppEvent", () => {
  let appEvent: AppEvent
  let logger: MockProxy<Logger>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppEvent,
        {
          provide: LOGGER,
          useValue: mock<Logger>(),
        },
      ],
    }).compile()

    appEvent = module.get<AppEvent>(AppEvent)
    logger = module.get(LOGGER)
  })

  it("should be defined", () => {
    expect(appEvent).toBeDefined()
  })

  describe("onReady", () => {
    it("should log client information and a ready message", () => {
      const mockClient = {
        user: {
          tag: "TestClient#0001",
          id: "123456789012345678",
        },
      } as Client<true>

      appEvent.onReady([mockClient])

      expect(logger.info).toHaveBeenCalledWith("Logged in as TestClient#0001 (123456789012345678)")
      expect(logger.info).toHaveBeenCalledWith("Discord bot is ready!")
      expect(logger.info).toHaveBeenCalledTimes(2)
    })
  })

  describe("onDebug", () => {
    it("should log a debug message", () => {
      const message = "debug message"
      appEvent.onDebug([message])
      expect(logger.debug).toHaveBeenCalledWith(message)
      expect(logger.debug).toHaveBeenCalledTimes(1)
    })
  })

  describe("onWarn", () => {
    it("should log a warning message", () => {
      const message = "warning message"
      appEvent.onWarn([message])
      expect(logger.warn).toHaveBeenCalledWith(message)
      expect(logger.warn).toHaveBeenCalledTimes(1)
    })
  })

  describe("onError", () => {
    it("should log an error message and the error object", () => {
      const error = new Error("test error")
      appEvent.onError([error])
      expect(logger.error).toHaveBeenCalledWith(error.message, error)
      expect(logger.error).toHaveBeenCalledTimes(1)
    })
  })
})
