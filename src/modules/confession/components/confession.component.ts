import { Button, ButtonContext, Context } from "necord"
import { CONFESSION_SHOW_MODAL, CONFESSION_REPLY } from "../constants/custom-id.constant"

export class ConfessionComponent {
  public constructor(
    private readonly showConfessionModalUseCase: any,
    private readonly replyConfessionUseCase: any,
  ) {}

  @Button(CONFESSION_SHOW_MODAL)
  public async showConfessionModal(@Context() [interaction]: ButtonContext): Promise<void> {
    await this.showConfessionModalUseCase.execute(interaction)
  }

  @Button(CONFESSION_REPLY)
  public async replyConfession(@Context() [interaction]: ButtonContext): Promise<void> {
    await this.replyConfessionUseCase.execute(interaction)
  }
}
