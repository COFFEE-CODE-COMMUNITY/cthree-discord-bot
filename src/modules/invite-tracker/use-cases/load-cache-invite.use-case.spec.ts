import { Client, Collection, Guild, Invite } from "discord.js"
import { LoadCacheInviteUseCase } from "./load-cache-invite.use-case"
import { inviteCache } from "../constants/cache-collection.constants"
import { Test, TestingModule } from "@nestjs/testing"
import { LOGGER } from "../../../common/interfaces/logger/logger.interface"

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

interface MockGuild {
  id: string
  name: string
  invites: {
    fetch: jest.Mock<Promise<Collection<string, Invite>>>
  }
}

const createMockGuild = (id: string, name: string, fetchedSuccessfully: boolean): MockGuild => ({
  id,
  name,
  invites: {
    fetch: jest.fn().mockImplementation((): Promise<Collection<string, Invite>> => {
      if (fetchedSuccessfully) {
        const invites = new Collection<string, Invite>()
        invites.set("invite1", { code: "invite1", uses: 5 } as Invite)
        invites.set("invite2", { code: "invite2", uses: null } as Invite)
        return Promise.resolve(invites)
      } else {
        return Promise.reject(new Error("Missing permissions"))
      }
    }),
  },
})

describe("LoadCacheInviteUseCase", () => {
  let useCase: LoadCacheInviteUseCase

  beforeEach(async () => {
    jest.clearAllMocks()
    inviteCache.clear()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoadCacheInviteUseCase,
        {
          provide: LOGGER,
          useValue: mockLogger,
        },
      ],
    }).compile()

    useCase = module.get<LoadCacheInviteUseCase>(LoadCacheInviteUseCase)
  })

  it("should be defined", () => {
    expect(useCase).toBeDefined()
  })

  it("should fetch and cache invites for all guilds successfully", async () => {
    const guild1 = createMockGuild("guild-1", "Test Guild 1", true)
    const guild2 = createMockGuild("guild-2", "Test Guild 2", true)

    const mockClient = {
      guilds: {
        cache: new Collection<string, Guild>([
          [guild1.id, guild1 as any],
          [guild2.id, guild2 as any],
        ]),
      },
    } as Client

    await useCase.execute(mockClient)

    expect(mockLogger.log).toHaveBeenCalledWith("Loading invite cache...")
    expect(guild1.invites.fetch).toHaveBeenCalledTimes(1)
    expect(guild2.invites.fetch).toHaveBeenCalledTimes(1)

    expect(inviteCache.has("guild-1")).toBe(true)
    expect(inviteCache.get("guild-1")?.get("invite1")).toBe(5)
    expect(inviteCache.get("guild-1")?.get("invite2")).toBe(0)
    expect(inviteCache.get("guild-2")?.size).toBe(2)

    expect(mockLogger.log).toHaveBeenCalledWith("Cached 2 invites for guild: Test Guild 1")
    expect(mockLogger.log).toHaveBeenCalledWith("Cached 2 invites for guild: Test Guild 2")
    expect(mockLogger.log).toHaveBeenCalledWith("Finished caching all guild invites.")
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it("should handle errors when fetching invites", async () => {
    const successfulGuild = createMockGuild("guild-1", "Success Guild", true)
    const failingGuild = createMockGuild("guild-2", "Failing Guild", false)

    const mockClient = {
      guilds: {
        cache: new Collection<string, Guild>([
          [successfulGuild.id, successfulGuild as any],
          [failingGuild.id, failingGuild as any],
        ]),
      },
    } as Client

    await useCase.execute(mockClient)

    expect(inviteCache.has("guild-1")).toBe(true)
    expect(mockLogger.log).toHaveBeenCalledWith("Cached 2 invites for guild: Success Guild")

    expect(inviteCache.has("guild-2")).toBe(false)
    expect(mockLogger.error).toHaveBeenCalledWith("Failed to fetch invites for guild: Failing Guild", expect.any(Error))
  })

  it("should run gracefully if the client has no guilds", async () => {
    const mockClient = {
      guilds: {
        cache: new Collection<string, Guild>(),
      },
    } as Client

    await useCase.execute(mockClient)

    expect(mockLogger.log).toHaveBeenCalledWith("Loading invite cache...")
    expect(mockLogger.log).toHaveBeenCalledWith("Finished caching all guild invites.")
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(inviteCache.size).toBe(0)
  })
})
