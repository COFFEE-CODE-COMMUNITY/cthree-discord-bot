import { Test, TestingModule } from "@nestjs/testing"
import { StatServerEvent } from "./stat-server.event"
import { StatServerService } from "../services/stat-server.service"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"

const mockStatServerService = {
  initialize: jest.fn(),
}

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  setContext: jest.fn(),
}

describe("StatServerEvent", () => {
  let statServerEvent: StatServerEvent
  let statServerService: StatServerService

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatServerEvent,
        {
          provide: StatServerService,
          useValue: mockStatServerService,
        },
        {
          provide: LOGGER,
          useValue: mockLogger,
        },
      ],
    }).compile()

    statServerEvent = module.get<StatServerEvent>(StatServerEvent)
    statServerService = module.get<StatServerService>(StatServerService)
  })

  it("should be defined", () => {
    expect(statServerEvent).toBeDefined()
  })

  describe("onReady", () => {
    it("should log a message and call the statServerService.initialize method", async () => {
      await statServerEvent.onReady()

      expect(mockLogger.log).toHaveBeenCalledTimes(1)
      expect(mockLogger.log).toHaveBeenCalledWith("Ready event caught by StatsEvents. Triggering service...")
      expect(statServerService.initialize).toHaveBeenCalledWith()
      expect(statServerService.initialize).toHaveBeenCalledTimes(1)
    })

    it("should handle errors if statServerService.initialize fails", async () => {
      const mockError = new Error("Failed to initialize")
      mockStatServerService.initialize.mockRejectedValue(mockError)

      await expect(statServerEvent.onReady()).rejects.toThrow(mockError)

      expect(mockLogger.log).toHaveBeenCalledTimes(1)
    })
  })
})
