import { TakeRoleServiceImpl } from "./take-role.service.impl"
import { TakeRoleRepository } from "../repositories/take-role.repository"
import { TakeRole } from "../entities/take-role.entity"

describe("TakeRoleServiceImpl", () => {
  let service: TakeRoleServiceImpl
  let mockRepo: jest.Mocked<TakeRoleRepository>

  const fakeData: TakeRole = {
    id: "1",
    guildId: "guild123",
    userId: "user123",
    channelId: "channel456",
    roleIds: ["role1", "role2"],
    embedTitle: "Test Title",
    embedBody: "Test Body",
    embedColor: "#ffffff",
    message: "Optional message",
    imageUrl: undefined,
    createdAt: new Date(),
  }

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAllByGuild: jest.fn(),
    } as unknown as jest.Mocked<TakeRoleRepository>

    service = new TakeRoleServiceImpl(mockRepo)
  })

  it("should create and save a take-role", async () => {
    const input: Partial<TakeRole> = {
      guildId: "guild123",
      userId: "user123",
      embedTitle: "Test Title",
    }

    const mockCreated = Object.assign({}, fakeData, input)

    mockRepo.create.mockReturnValue(mockCreated)
    mockRepo.save.mockResolvedValue(mockCreated)

    const result = await service.create(input)

    expect(mockRepo.create).toHaveBeenCalledWith(input)
    expect(mockRepo.save).toHaveBeenCalledWith(mockCreated)
    expect(result).toEqual(mockCreated)
  })

  it("should find a take-role by id", async () => {
    mockRepo.findById.mockResolvedValue(fakeData)

    const result = await service.findById("1")

    expect(mockRepo.findById).toHaveBeenCalledWith("1")
    expect(result).toEqual(fakeData)
  })

  it("should find all take-roles by guild ID", async () => {
    mockRepo.findAllByGuild.mockResolvedValue([fakeData])

    const result = await service.findAllByGuild("guild123")

    expect(mockRepo.findAllByGuild).toHaveBeenCalledWith("guild123")
    expect(result).toEqual([fakeData])
  })
})
