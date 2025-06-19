import { Injectable } from "@nestjs/common"
import { Context, ContextOf, On } from "necord"
import { GreetNewMemberUseCase } from "../use-cases/greet-new-member.use-case"

@Injectable()
export class WelcomeEvent {
  public constructor(private readonly greetNewMemberUsecase: GreetNewMemberUseCase) {}

  @On("guildMemberAdd")
  public async onGuildMemberAdd(@Context() [member]: ContextOf<"guildMemberAdd">): Promise<void> {
    await this.greetNewMemberUsecase.execute(member)
  }
}
