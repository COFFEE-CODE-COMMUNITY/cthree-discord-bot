import { ShowTakeRoleModalUseCase } from "./show-take-role-modal.use-case"
import { ChatInputCommandInteraction, ModalBuilder } from "discord.js"
import { Logger } from "../../../common/interfaces/logger/logger.interface"

describe("ShowTakeRoleModalUseCase", () => {
  let useCase: ShowTakeRoleModalUseCase
  let mockLogger: jest.Mocked<Logger>
  let mockInteraction: jest.Mocked<ChatInputCommandInteraction>

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
    } as any

    mockInteraction = {
      id: "interaction123",
      user: { id: "user456" },
      showModal: jest.fn(),
    } as any

    useCase = new ShowTakeRoleModalUseCase(mockLogger)
  })

  it("should show a modal with expected title and customId", async () => {
    await useCase.execute(mockInteraction)

    expect(mockInteraction.showModal).toHaveBeenCalledTimes(1)

    // 👇 Type assertion ke ModalBuilder
    const modalArg = mockInteraction.showModal.mock.calls[0][0] as ModalBuilder
    const modalData = modalArg.toJSON()

    expect(modalData).toMatchObject({
      title: "Create Take Role Embed",
      custom_id: "takeRoleModal",
      components: expect.any(Array),
    })

    // Cek salah satu komponen
    expect(modalData.components[0].components[0]).toMatchObject({
      custom_id: "message",
      label: "Message (optional)",
      placeholder: "Pesan sebelum embed",
      required: false,
      style: 2,
      type: 4,
    })
  })

  it("should call logger.debug with interactionId and userId", async () => {
    await useCase.execute(mockInteraction)

    expect(mockLogger.debug).toHaveBeenCalledWith("Take Role modal shown", {
      interactionId: "interaction123",
      userId: "user456",
    })
  })
})
