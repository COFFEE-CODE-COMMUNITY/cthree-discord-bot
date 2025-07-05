import { InviteTrackerEvent } from "./invite-tracker.event"
import { LoadCacheInviteUseCase } from "../use-cases/load-cache-invite.use-case"
import { TrackInviteUseCase } from "../use-cases/track-invite.use-case"
import { Test, TestingModule } from "@nestjs/testing"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { Client, GuildMember } from "discord.js"

const mockLoadCacheInviteTrackerUseCase = {
  execute: jest.fn(),
}

const mockTrackInviteUseCase = {
  execute: jest.fn(),
}

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

describe("InviteTrackerEvent", () => {
  let event: InviteTrackerEvent
  let loadCacheInviteUseCase: LoadCacheInviteUseCase
  let trackInviteUseCases: TrackInviteUseCase

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteTrackerEvent,
        {
          provide: LoadCacheInviteUseCase,
          useValue: mockLoadCacheInviteTrackerUseCase,
        },
        {
          provide: TrackInviteUseCase,
          useValue: mockTrackInviteUseCase,
        },
        {
          provide: LOGGER,
          useValue: mockLogger,
        },
      ],
    }).compile()

    event = module.get<InviteTrackerEvent>(InviteTrackerEvent)
    loadCacheInviteUseCase = module.get<LoadCacheInviteUseCase>(LoadCacheInviteUseCase)
    trackInviteUseCases = module.get<TrackInviteUseCase>(TrackInviteUseCase)
  })

  it("should be defined", () => {
    expect(event).toBeDefined()
  })

  describe("onReady", () => {
    it("should call logger and loadCacheInviteUseCase on ready event", async () => {
      const mockClient = {} as Client

      await event.onReady([mockClient])

      expect(mockLogger.log).toHaveBeenCalledWith({
        "Client is ready, delegating to LoadInvitesCacheUseCase.": true,
      })

      expect(loadCacheInviteUseCase.execute).toHaveBeenCalledWith(mockClient)
    })
  })

  describe("onGuildMemberAdd", () => {
    it("should call trackInviteUseCases on guildMemberAdd event", async () => {
      const mockMember = {} as GuildMember

      await event.onGuildMemberAdd([mockMember])

      expect(trackInviteUseCases.execute).toHaveBeenCalledWith(mockMember)
    })
  })
})
