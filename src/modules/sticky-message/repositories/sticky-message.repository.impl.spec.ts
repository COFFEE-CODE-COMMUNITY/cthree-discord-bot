import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { StickyMessageRepositoryImpl } from "./sticky-message.repository.impl"
import { StickyMessage } from "../entities/sticky-message.entity"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"

describe("StickyMessageRepositoryImpl", () => {
  let repository: StickyMessageRepositoryImpl
  let typeormRepository: DeepMockProxy<Repository<StickyMessage>>
  let logger: DeepMockProxy<Logger>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickyMessageRepositoryImpl,
        {
          provide: getRepositoryToken(StickyMessage),
          useValue: mockDeep<Repository<StickyMessage>>(),
        },
        {
          provide: LOGGER,
          useValue: mockDeep<Logger>(),
        },
      ],
    }).compile()

    repository = module.get<StickyMessageRepositoryImpl>(StickyMessageRepositoryImpl)
    typeormRepository = module.get(getRepositoryToken(StickyMessage))
    logger = module.get(LOGGER)
  })

  it("should be defined", () => {
    expect(repository).toBeDefined()
  })

  describe("create", () => {
    it("should save a sticky message", async () => {
      const stickyMessage = new StickyMessage()
      typeormRepository.save.mockResolvedValue(stickyMessage)

      const result = await repository.create(stickyMessage)

      expect(result).toBe(stickyMessage)
      expect(typeormRepository.save).toHaveBeenCalledWith(stickyMessage)
    })
  })

  describe("delete", () => {
    it("should delete a sticky message", async () => {
      const id = "some-id"
      await repository.delete(id)
      expect(typeormRepository.delete).toHaveBeenCalledWith(id)
    })
  })

  describe("deleteByChannelId", () => {
    it("should delete a sticky message by channel id", async () => {
      const channelId = "some-channel-id"
      await repository.deleteByChannelId(channelId)
      expect(typeormRepository.delete).toHaveBeenCalledWith({ channelId })
    })
  })

  describe("deleteByGuildId", () => {
    it("should delete a sticky message by guild id", async () => {
      const guildId = "some-guild-id"
      await repository.deleteByGuildId(guildId)
      expect(typeormRepository.delete).toHaveBeenCalledWith({ guildId })
    })
  })

  describe("findAll", () => {
    it("should return an array of sticky messages", async () => {
      const stickyMessages = [new StickyMessage(), new StickyMessage()]
      typeormRepository.find.mockResolvedValue(stickyMessages)

      const result = await repository.findAll()

      expect(result).toBe(stickyMessages)
      expect(typeormRepository.find).toHaveBeenCalled()
    })
  })

  describe("findById", () => {
    it("should return a sticky message if found", async () => {
      const id = "some-id"
      const stickyMessage = new StickyMessage()
      typeormRepository.findOne.mockResolvedValue(stickyMessage)

      const result = await repository.findById(id)

      expect(result).toBe(stickyMessage)
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } })
    })

    it("should return null if sticky message not found", async () => {
      const id = "some-id"
      typeormRepository.findOne.mockResolvedValue(null)

      const result = await repository.findById(id)

      expect(result).toBeNull()
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } })
    })
  })

  describe("findByChannelId", () => {
    it("should return a sticky message if found by channel id", async () => {
      const channelId = "some-channel-id"
      const stickyMessage = new StickyMessage()
      typeormRepository.findOne.mockResolvedValue(stickyMessage)

      const result = await repository.findByChannelId(channelId)

      expect(result).toBe(stickyMessage)
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { channelId } })
    })

    it("should return null if sticky message not found by channel id", async () => {
      const channelId = "some-channel-id"
      typeormRepository.findOne.mockResolvedValue(null)

      const result = await repository.findByChannelId(channelId)

      expect(result).toBeNull()
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { channelId } })
    })
  })

  describe("update", () => {
    it("should update a sticky message and return the updated entity", async () => {
      const id = "some-id"
      const stickyMessage = new StickyMessage()
      // const updatedStickyMessage = { ...stickyMessage, message: "updated" }
      const updatedStickyMessage = Object.assign(stickyMessage, { message: "updated" })

      typeormRepository.findOne.mockResolvedValue(updatedStickyMessage)

      const result = await repository.update(id, stickyMessage)

      expect(typeormRepository.update).toHaveBeenCalledWith(id, stickyMessage)
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } })
      expect(result).toBe(updatedStickyMessage)
    })

    it("should throw an error if the entity to update is not found", async () => {
      const id = "some-id"
      const stickyMessage = new StickyMessage()

      typeormRepository.findOne.mockResolvedValue(null)

      await expect(repository.update(id, stickyMessage)).rejects.toThrow(`StickyMessage with id ${id} not found.`)

      expect(logger.error).toHaveBeenCalledWith(`StickyMessage with id ${id} not found during update.`)
    })
  })

  describe("updateByChannelId", () => {
    it("should update a sticky message by channel id and return the updated entity", async () => {
      const channelId = "some-channel-id"
      const stickyMessage = new StickyMessage()
      // const updatedStickyMessage = { ...stickyMessage, message: "updated" }
      const updatedStickyMessage = Object.assign(stickyMessage, { message: "updated" })

      typeormRepository.findOne.mockResolvedValue(updatedStickyMessage)

      const result = await repository.updateByChannelId(channelId, stickyMessage)

      expect(typeormRepository.update).toHaveBeenCalledWith({ channelId }, stickyMessage)
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { channelId } })
      expect(result).toBe(updatedStickyMessage)
    })

    it("should throw an error if the entity to update is not found by channel id", async () => {
      const channelId = "some-channel-id"
      const stickyMessage = new StickyMessage()

      typeormRepository.findOne.mockResolvedValue(null)

      await expect(repository.updateByChannelId(channelId, stickyMessage)).rejects.toThrow(
        `StickyMessage with channelId ${channelId} not found.`,
      )

      expect(logger.error).toHaveBeenCalledWith(`StickyMessage with channelId ${channelId} not found during update.`)
    })
  })
})
