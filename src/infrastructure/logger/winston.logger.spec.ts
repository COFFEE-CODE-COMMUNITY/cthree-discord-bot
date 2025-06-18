import { Test, TestingModule } from "@nestjs/testing"
import { WinstonLogger } from "./winston.logger"
import { ConfigService } from "@nestjs/config"
import { INQUIRER } from "@nestjs/core"
import { LogLevel } from "../../common/enums/log-level.enum"
import winston from "winston"
import { mock, MockProxy } from "jest-mock-extended"

const mockWinstonLogger = {
  log: jest.fn(),
  add: jest.fn(),
}

jest.mock("winston", () => ({
  ...jest.requireActual("winston"),
  createLogger: jest.fn(() => mockWinstonLogger),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  format: {
    combine: jest.fn((...args) => args),
    timestamp: jest.fn(),
    printf: jest.fn(),
    json: jest.fn(),
  },
}))

class MockParentClass {}

describe("WinstonLogger", () => {
  let logger: WinstonLogger
  let configService: MockProxy<ConfigService>

  const createTestingModule = async (configValues: Record<string, any>): Promise<WinstonLogger> => {
    configService = mock<ConfigService>()
    configService.get.mockImplementation((key: string, defaultValue?: any) => {
      return configValues[key] !== undefined ? configValues[key] : defaultValue
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinstonLogger,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: INQUIRER,
          useValue: new MockParentClass(),
        },
      ],
    }).compile()

    return module.resolve<WinstonLogger>(WinstonLogger)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", async () => {
    logger = await createTestingModule({})
    expect(logger).toBeDefined()
  })

  it("should create logger with default info level if not specified in config", async () => {
    logger = await createTestingModule({})
    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogLevel.INFO,
      }),
    )
  })

  it("should create logger with the level from config", async () => {
    logger = await createTestingModule({ "logger.level": LogLevel.DEBUG })
    expect(winston.createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        level: LogLevel.DEBUG,
      }),
    )
  })

  it("should add a file transport when enabled in config", async () => {
    logger = await createTestingModule({
      "logger.file.enabled": true,
      "logger.file.outputPath": "test.log",
      "logger.level": LogLevel.WARN,
    })

    expect(mockWinstonLogger.add).toHaveBeenCalledTimes(1)
    expect(winston.transports.File).toHaveBeenCalledWith({
      filename: "test.log",
      level: LogLevel.WARN,
      format: undefined,
    })
  })

  it("should not add a file transport when disabled in config", async () => {
    logger = await createTestingModule({ "logger.file.enabled": false })
    expect(mockWinstonLogger.add).not.toHaveBeenCalled()
  })

  it("should not add a file transport when config is not present", async () => {
    logger = await createTestingModule({})
    expect(mockWinstonLogger.add).not.toHaveBeenCalled()
  })

  describe("logging methods", () => {
    beforeEach(async () => {
      logger = await createTestingModule({})
    })

    it("should call underlying logger with TRACE level for trace()", () => {
      logger.trace("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.TRACE, "test message", { data: "test" })
    })

    it("should call underlying logger with DEBUG level for debug()", () => {
      logger.debug("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.DEBUG, "test message", { data: "test" })
    })

    it("should call underlying logger with VERBOSE level for verbose()", () => {
      logger.verbose("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.VERBOSE, "test message", { data: "test" })
    })

    it("should call underlying logger with INFO level for info()", () => {
      logger.info("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.INFO, "test message", { data: "test" })
    })

    it("should call underlying logger with INFO level for log()", () => {
      logger.log("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.INFO, "test message", { data: "test" })
    })

    it("should call underlying logger with WARN level for warn()", () => {
      logger.warn("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.WARN, "test message", { data: "test" })
    })

    it("should call underlying logger with ERROR level for error()", () => {
      logger.error("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.ERROR, "test message", { data: "test" })
    })

    it("should call underlying logger with FATAL level for fatal()", () => {
      logger.fatal("test message", { data: "test" })
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(LogLevel.FATAL, "test message", { data: "test" })
    })
  })
})
