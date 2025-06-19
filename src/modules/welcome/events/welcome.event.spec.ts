import { Test, TestingModule } from "@nestjs/testing"
import { WelcomeEvent } from "./welcome.event"
import { GreetNewMemberUseCase } from "../use-cases/greet-new-member.use-case"
import { mock, MockProxy } from "jest-mock-extended"
import { GuildMember } from "discord.js"

describe("WelcomeEvent", () => {
  let welcomeEvent: WelcomeEvent
  let greetNewMemberUsecase: MockProxy<GreetNewMemberUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeEvent,
        {
          provide: GreetNewMemberUseCase,
          useValue: mock<GreetNewMemberUseCase>(),
        },
      ],
    }).compile()

    welcomeEvent = module.get<WelcomeEvent>(WelcomeEvent)
    greetNewMemberUsecase = module.get(GreetNewMemberUseCase)
  })

  it("should be defined", () => {
    expect(welcomeEvent).toBeDefined()
  })

  describe("onGuildMemberAdd", () => {
    it("should call GreetNewMemberUseCase with the new member", async () => {
      const mockMember = {} as GuildMember

      await welcomeEvent.onGuildMemberAdd([mockMember])

      expect(greetNewMemberUsecase.execute).toHaveBeenCalledWith(mockMember)
      expect(greetNewMemberUsecase.execute).toHaveBeenCalledTimes(1)
    })
  })
})
