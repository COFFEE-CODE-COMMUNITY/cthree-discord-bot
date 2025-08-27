import { Test, TestingModule } from "@nestjs/testing"
import { TakeRoleCommand } from "./take-role.command"
import { ShowTakeRoleModalUseCase } from "../use-cases/show-take-role-modal.use-case"

describe("TakeRoleCommand", () => {
  let command: TakeRoleCommand
  let showTakeRoleModalUseCase: ShowTakeRoleModalUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TakeRoleCommand,
        {
          provide: ShowTakeRoleModalUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile()

    command = module.get(TakeRoleCommand)
    showTakeRoleModalUseCase = module.get(ShowTakeRoleModalUseCase)
  })

  it("should call showTakeRoleModalUseCase.execute with interaction", async () => {
    const mockInteraction = { id: "123" } as any

    await command.create([mockInteraction])

    expect(showTakeRoleModalUseCase.execute).toHaveBeenCalledWith(mockInteraction)
    expect(showTakeRoleModalUseCase.execute).toHaveBeenCalledTimes(1)
  })
})
