import { Test, TestingModule } from "@nestjs/testing"
import { TakeRoleEvent } from "./take-role.event"
import { ModalTakeRoleSubmitHandler } from "../handlers/modal-take-role-submit.handler"
import { SelectTakeRoleChannelHandler } from "../handlers/select-take-role-channel.handler"
import { SelectTakeRoleRolesHandler } from "../handlers/select-take-role-roles.handler"
import { ButtonTakeRoleInteractionHandler } from "../handlers/button-take-role-interaction.handler"

describe("TakeRoleEvent", () => {
  let event: TakeRoleEvent
  let modalHandler: ModalTakeRoleSubmitHandler
  let channelHandler: SelectTakeRoleChannelHandler
  let roleHandler: SelectTakeRoleRolesHandler
  let buttonHandler: ButtonTakeRoleInteractionHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TakeRoleEvent,
        {
          provide: ModalTakeRoleSubmitHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SelectTakeRoleChannelHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SelectTakeRoleRolesHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ButtonTakeRoleInteractionHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile()

    event = module.get(TakeRoleEvent)
    modalHandler = module.get(ModalTakeRoleSubmitHandler)
    channelHandler = module.get(SelectTakeRoleChannelHandler)
    roleHandler = module.get(SelectTakeRoleRolesHandler)
    buttonHandler = module.get(ButtonTakeRoleInteractionHandler)
  })

  it("should handle modal submit interaction", async () => {
    const interaction: any = {
      isModalSubmit: () => true,
      customId: "takeRoleModal",
    }

    await event.onInteractionCreate([interaction])
    expect(modalHandler.execute).toHaveBeenCalledWith(interaction)
  })

  it("should handle channel select menu interaction", async () => {
    const interaction: any = {
      isModalSubmit: () => false,
      isChannelSelectMenu: () => true,
      customId: "takeRoleSelectChannel",
    }

    await event.onInteractionCreate([interaction])
    expect(channelHandler.execute).toHaveBeenCalledWith(interaction)
  })

  it("should handle role select menu interaction", async () => {
    const interaction: any = {
      isModalSubmit: () => false,
      isChannelSelectMenu: () => false,
      isRoleSelectMenu: () => true,
      customId: "takeRoleSelectRoles",
    }

    await event.onInteractionCreate([interaction])
    expect(roleHandler.execute).toHaveBeenCalledWith(interaction)
  })

  it("should handle button interaction", async () => {
    const interaction: any = {
      isModalSubmit: () => false,
      isChannelSelectMenu: () => false,
      isRoleSelectMenu: () => false,
      isButton: () => true,
      customId: "takeRoleBtn:abc:123",
    }

    await event.onInteractionCreate([interaction])
    expect(buttonHandler.execute).toHaveBeenCalledWith(interaction)
  })

  it("should ignore unrelated interactions", async () => {
    const interaction: any = {
      isModalSubmit: () => false,
      isChannelSelectMenu: () => false,
      isRoleSelectMenu: () => false,
      isButton: () => false,
    }

    await event.onInteractionCreate([interaction])

    expect(modalHandler.execute).not.toHaveBeenCalled()
    expect(channelHandler.execute).not.toHaveBeenCalled()
    expect(roleHandler.execute).not.toHaveBeenCalled()
    expect(buttonHandler.execute).not.toHaveBeenCalled()
  })
})
