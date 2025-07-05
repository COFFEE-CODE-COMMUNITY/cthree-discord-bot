import { Test, TestingModule } from "@nestjs/testing"
import { StickyMessageServiceImpl } from "./sticky-message.service.impl"
import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { TemporaryUserPayload } from "./sticky-message.service"

describe("StickyMessageServiceImpl", () => {
  let service: StickyMessageServiceImpl
  let logger: DeepMockProxy<Logger>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickyMessageServiceImpl,
        {
          provide: LOGGER,
          useValue: mockDeep<Logger>(),
        },
      ],
    }).compile()

    service = module.get<StickyMessageServiceImpl>(StickyMessageServiceImpl)
    logger = module.get(LOGGER)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("setTemporaryUser", () => {
    it("should set a temporary user", () => {
      const userId = "user1"
      const payload: TemporaryUserPayload = { channelId: "channel1" }
      service.setTemporaryUser(userId, payload)
      expect(service.getTemporaryUser(userId)).toEqual(payload)
    })
  })

  describe("getTemporaryUser", () => {
    it("should return a temporary user if it exists", () => {
      const userId = "user1"
      const payload: TemporaryUserPayload = { channelId: "channel1" }
      service.setTemporaryUser(userId, payload)
      expect(service.getTemporaryUser(userId)).toEqual(payload)
    })

    it("should return null if the temporary user does not exist", () => {
      expect(service.getTemporaryUser("nonexistentuser")).toBeNull()
    })
  })

  describe("deleteTemporaryUser", () => {
    it("should delete a temporary user if it exists", () => {
      const userId = "user1"
      const payload: TemporaryUserPayload = { channelId: "channel1" }
      service.setTemporaryUser(userId, payload)
      service.deleteTemporaryUser(userId)
      expect(service.getTemporaryUser(userId)).toBeNull()
    })

    it("should log a warning if the temporary user does not exist", () => {
      const userId = "nonexistentuser"
      service.deleteTemporaryUser(userId)
      expect(logger.warn).toHaveBeenCalledWith(`Temporary user with ID ${userId} does not exist.`)
    })
  })
})
