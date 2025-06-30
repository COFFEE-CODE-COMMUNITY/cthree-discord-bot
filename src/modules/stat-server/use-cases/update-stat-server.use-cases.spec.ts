import { Test, TestingModule } from "@nestjs/testing"
import { UpdateStatServerUseCases } from "./update-stat-server.use-cases"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"
import { Guild, Collection, GuildBasedChannel } from "discord.js"
import { RoleStatMap } from "../constants/stat-server.constants"

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  setContext: jest.fn(),
}

const mockChannel = {
  name: "C3 Core: 0",
  setName: jest.fn().mockResolvedValue(true),
}

const mockGuild = {
  name: "Mock Guild",
  channels: {
    fetch: jest.fn().mockResolvedValue(mockChannel as unknown as GuildBasedChannel),
  },
  members: {
    cache: new Collection(),
  },
} as unknown as Guild

const mockMappings: RoleStatMap[] = [
  {
    roleId: "role-123",
    channelId: "channel-123",
    label: "C3 Core",
  },
]

describe("UpdateStatServerUseCases", () => {
  let useCase: UpdateStatServerUseCases

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateStatServerUseCases, { provide: LOGGER, useValue: mockLogger }],
    }).compile()

    useCase = module.get<UpdateStatServerUseCases>(UpdateStatServerUseCases)
    ;(mockGuild.channels.fetch as jest.Mock).mockResolvedValue(mockChannel)
    mockGuild.members.cache.clear()
    mockChannel.name = "C3 Core: 0"
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  describe("execute", () => {
    it("should update channel name when member count changes", async () => {
      mockGuild.members.cache.set("user-1", { roles: { cache: { has: () => true } } } as any)

      await useCase.execute(mockGuild, mockMappings)

      expect(mockLogger.log).toHaveBeenCalledWith("Changes detected for C3 Core: -1 -> 1")
      expect(mockGuild.channels.fetch).toHaveBeenCalledWith("channel-123")
      expect(mockChannel.setName).toHaveBeenCalledWith("C3 Core: 1")
    })

    it("should NOT update channel name if count changes but name is already correct", async () => {
      mockGuild.members.cache.set("user-1", { roles: { cache: { has: () => true } } } as any)
      mockChannel.name = "C3 Core: 1"

      await useCase.execute(mockGuild, mockMappings)

      expect(mockLogger.log).toHaveBeenCalledWith("Changes detected for C3 Core: -1 -> 1")
      expect(mockGuild.channels.fetch).toHaveBeenCalledWith("channel-123")
      expect(mockChannel.setName).not.toHaveBeenCalled()
    })

    it("should do nothing if member count has not changed", async () => {
      await useCase.execute(mockGuild, mockMappings)
      jest.clearAllMocks()
      await useCase.execute(mockGuild, mockMappings)

      expect(mockLogger.log).not.toHaveBeenCalledWith(expect.stringContaining("Changes detected"))
      expect(mockGuild.channels.fetch).not.toHaveBeenCalled()
    })

    it("should handle errors gracefully if a channel cannot be fetched", async () => {
      const fetchError = new Error("Missing Permissions")
      ;(mockGuild.channels.fetch as jest.Mock).mockRejectedValue(fetchError)
      mockGuild.members.cache.set("user-1", { roles: { cache: { has: () => true } } } as any)

      await useCase.execute(mockGuild, mockMappings)

      expect(mockLogger.error).toHaveBeenCalledWith('Error updating stats for "C3 Core":', fetchError)
      expect(mockChannel.setName).not.toHaveBeenCalled()
    })
  })
})
