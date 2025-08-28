import { Test, TestingModule } from "@nestjs/testing"
import { EmbedCommand } from "./embed.command"
import { CreateEmbedUseCase } from "../use-cases/create-embed.use-case"
import { EditEmbedUseCase } from "../use-cases/edit-embed.use-case"
import { ShowEmbedUseCase } from "../use-cases/show-embed.use-case"
import { CreateEmbedDto } from "../dtos/create-embed.dto"
import { EditEmbedDto } from "../dtos/edit-embed.dto"
import { ShowEmbedDto } from "../dtos/show-embed.dto"
import { ChatInputCommandInteraction } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"

describe("EmbedCommand", (): void => {
  let command: EmbedCommand
  let createEmbedUseCase: CreateEmbedUseCase
  let editEmbedUseCase: EditEmbedUseCase
  let showEmbedUseCase: ShowEmbedUseCase

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbedCommand,
        {
          provide: CreateEmbedUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: EditEmbedUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ShowEmbedUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: EmbedRepository,
          useValue: {},
        },
      ],
    }).compile()

    command = module.get(EmbedCommand)
    createEmbedUseCase = module.get(CreateEmbedUseCase)
    editEmbedUseCase = module.get(EditEmbedUseCase)
    showEmbedUseCase = module.get(ShowEmbedUseCase)
  })

  it("should call createEmbedUseCase.execute with interaction and dto", async (): Promise<void> => {
    const interaction = {
      options: {},
    } as unknown as ChatInputCommandInteraction

    const dto: CreateEmbedDto = {
      name: "welcome-embed",
    }

    await command.create([interaction], dto)

    expect(createEmbedUseCase.execute).toHaveBeenCalledWith(interaction, dto)
  })

  it("should call editEmbedUseCase.execute with interaction and dto", async (): Promise<void> => {
    const interaction = {
      options: {},
    } as unknown as ChatInputCommandInteraction

    const dto: EditEmbedDto = {
      name: "announcement-embed",
    }

    await command.edit([interaction], dto)

    expect(editEmbedUseCase.execute).toHaveBeenCalledWith(interaction, dto)
  })

  it("should call showEmbedUseCase.execute with interaction and dto", async (): Promise<void> => {
    const interaction = {
      options: {},
    } as unknown as ChatInputCommandInteraction

    const dto: ShowEmbedDto = {
      name: "rules-embed",
    }

    await command.show([interaction], dto)

    expect(showEmbedUseCase.execute).toHaveBeenCalledWith(interaction, dto)
  })
})
