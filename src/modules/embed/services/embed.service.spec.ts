import { EmbedService } from "./embed.service"
import { Embed } from "../entities/embed.entity"
import { ButtonBuilder, EmbedBuilder, ActionRowBuilder, Message } from "discord.js"

describe("EmbedService", (): void => {
  let service: EmbedService

  beforeEach((): void => {
    service = new EmbedService()
  })

  describe("getEmbedButtonsEditor", (): void => {
    it("should return 4 buttons with correct customIds and labels", (): void => {
      const embed: Embed = {
        id: "abc123",
      } as Embed

      const result: ButtonBuilder[] = service.getEmbedButtonsEditor(embed)

      expect(result).toHaveLength(4)

      const json1 = result[0].toJSON() as { custom_id: string; label: string }
      const json2 = result[1].toJSON() as { custom_id: string; label: string }
      const json3 = result[2].toJSON() as { custom_id: string; label: string }
      const json4 = result[3].toJSON() as { custom_id: string; label: string }

      expect(json1.custom_id).toBe("edit-embed-basic-information/abc123")
      expect(json1.label).toBe("Edit Basic Information")

      expect(json2.custom_id).toBe("edit-embed-author/abc123")
      expect(json2.label).toBe("Edit Author")

      expect(json3.custom_id).toBe("edit-embed-images/abc123")
      expect(json3.label).toBe("Edit Images")

      expect(json4.custom_id).toBe("edit-embed-footer/abc123")
      expect(json4.label).toBe("Edit Footer")
    })
  })

  describe("getEmbedViewer", (): void => {
    it("should build embed with all fields set", (): void => {
      const embed: Embed = {
        title: "Title",
        description: "Desc",
        hexColor: "#ff0000",
        mainImageUrl: "https://main.img",
        thumbnailImageUrl: "https://thumb.img",
        author: "Author Name",
        authorIconUrl: "https://author.icon",
        footerText: "Footer Text",
        footerIconUrl: "https://footer.icon",
        footerTimestamp: true,
      } as Embed

      const result: EmbedBuilder = service.getEmbedViewer(embed)
      const data = result.data

      expect(data.title).toBe("Title")
      expect(data.description).toBe("Desc")
      expect(data.color).toBeDefined()
      expect(data.image?.url).toBe("https://main.img")
      expect(data.thumbnail?.url).toBe("https://thumb.img")
      expect(data.author?.name).toBe("Author Name")
      expect(data.author?.icon_url).toBe("https://author.icon")
      expect(data.footer?.text).toBe("Footer Text")
      expect(data.footer?.icon_url).toBe("https://footer.icon")
      expect(data.timestamp).toBeDefined()
    })

    it("should handle missing optional fields", (): void => {
      const embed: Embed = {} as Embed
      const result: EmbedBuilder = service.getEmbedViewer(embed)

      const data = result.data

      expect(data.title).toBeUndefined()
      expect(data.description).toBeUndefined()
      expect(data.color).toBeUndefined()
      expect(data.image?.url).toBeUndefined()
      expect(data.thumbnail?.url).toBeUndefined()
      expect(data.author).toBeUndefined()
      expect(data.footer).toBeUndefined()
    })
  })

  describe("editEmbedEditorMessage", (): void => {
    it("should edit message with embed and components", async (): Promise<void> => {
      const embed: Embed = {
        id: "abc",
        title: "T",
      } as Embed

      const message = {
        edit: jest.fn(),
      } as unknown as Message<boolean>

      await service.editEmbedEditorMessage(message, embed)

      expect(message.edit).toHaveBeenCalled()

      const call = (message.edit as jest.Mock).mock.calls[0][0]

      expect(call.embeds).toHaveLength(1)
      expect(call.components).toHaveLength(1)

      const row = call.components[0] as ActionRowBuilder<ButtonBuilder>
      expect(row.components).toHaveLength(4)
    })
  })
})
