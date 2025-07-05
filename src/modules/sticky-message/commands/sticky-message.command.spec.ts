import { Test, TestingModule } from "@nestjs/testing"
import { StickyMessageCommand } from "./sticky-message.command"
import { EnableStickyMessageUseCase } from "../use-cases/enable-sticky-message.use-case"
import { DisableStickyMessageUseCase } from "../use-cases/disable-sticky-message.use-case"
import { ClearStickyMessageUseCase } from "../use-cases/clear-sticky-message.use-case"
import { DeepMockProxy, mockDeep } from "jest-mock-extended"
import { SlashCommandContext } from "necord"
import { ChatInputCommandInteraction } from "discord.js"
import { EnableStickyMessageDto } from "../dtos/enable-sticky-message.dto"
import { DisableStickyMessageDto } from "../dtos/disable-sticky-message.dto"

describe("StickyMessageCommand", () => {
  let command: StickyMessageCommand
  let enableUseCase: DeepMockProxy<EnableStickyMessageUseCase>
  let disableUseCase: DeepMockProxy<DisableStickyMessageUseCase>
  let clearUseCase: DeepMockProxy<ClearStickyMessageUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StickyMessageCommand,
        {
          provide: EnableStickyMessageUseCase,
          useValue: mockDeep<EnableStickyMessageUseCase>(),
        },
        {
          provide: DisableStickyMessageUseCase,
          useValue: mockDeep<DisableStickyMessageUseCase>(),
        },
        {
          provide: ClearStickyMessageUseCase,
          useValue: mockDeep<ClearStickyMessageUseCase>(),
        },
      ],
    }).compile()

    command = module.get<StickyMessageCommand>(StickyMessageCommand)
    enableUseCase = module.get(EnableStickyMessageUseCase)
    disableUseCase = module.get(DisableStickyMessageUseCase)
    clearUseCase = module.get(ClearStickyMessageUseCase)
  })

  it("should be defined", () => {
    expect(command).toBeDefined()
  })

  describe("enable", () => {
    it("should call enableStickyMessageUseCase.execute", async () => {
      const interaction = mockDeep<ChatInputCommandInteraction>()
      const context: SlashCommandContext = [interaction]
      const options = new EnableStickyMessageDto()

      await command.enable(context, options)

      expect(enableUseCase.execute).toHaveBeenCalledWith(interaction, options)
    })
  })

  describe("disable", () => {
    it("should call disableStickyMessageUseCase.execute", async () => {
      const interaction = mockDeep<ChatInputCommandInteraction>()
      const context: SlashCommandContext = [interaction]
      const options = new DisableStickyMessageDto()

      await command.disable(context, options)

      expect(disableUseCase.execute).toHaveBeenCalledWith(interaction, options)
    })
  })

  describe("clear", () => {
    it("should call clearStickyMessageUseCase.execute", async () => {
      const interaction = mockDeep<ChatInputCommandInteraction>()
      const context: SlashCommandContext = [interaction]

      await command.clear(context)

      expect(clearUseCase.execute).toHaveBeenCalledWith(interaction)
    })
  })
})
