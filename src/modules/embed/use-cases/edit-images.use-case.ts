import { Injectable } from "@nestjs/common"
import { EmbedService } from "../services/embed.service"
import { EmbedRepository } from "../repositories/embed.repository"
import { ModalSubmitInteraction, Message, ModalSubmitFields } from "discord.js"
import { z } from "zod"
import { ValidationService } from "../../../common/services/validation.service"

@Injectable()
export class EditImagesUseCase {
  public constructor(
    private readonly embedService: EmbedService,
    private readonly embedRepository: EmbedRepository,
    private readonly validationService: ValidationService,
  ) {}

  public async execute(interaction: ModalSubmitInteraction, embedId: string, messageId: string): Promise<void> {
    const embed = await this.embedRepository.findById(embedId)

    if (!embed) {
      await interaction.reply({
        content: "Embed not found.",
        flags: "Ephemeral",
      })
      return
    }

    if (!interaction.channel) {
      await interaction.reply({
        content: "Channel not accessible.",
        flags: "Ephemeral",
      })
      return
    }

    const message = await interaction.channel.messages.fetch(messageId)

    if (!(message instanceof Message)) {
      await interaction.reply({
        content: "Message not found.",
        flags: "Ephemeral",
      })
      return
    }

    try {
      const fields = await this.validateField(interaction.fields)
      embed.mainImageUrl = fields.mainImageUrl
      embed.thumbnailImageUrl = fields.thumbnailImageUrl

      const savedEmbed = await this.embedRepository.save(embed)
      await this.embedService.editEmbedEditorMessage(message, savedEmbed)

      await interaction.deferUpdate()
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        await interaction.reply({
          content: `Validation error: ${error.errors.map(e => e.message).join(", ")}`,
          flags: "Ephemeral",
        })
      } else {
        await interaction.reply({
          content: "An unexpected error occurred.",
          flags: "Ephemeral",
        })
      }
    }
  }

  private async validateField(fields: ModalSubmitFields): Promise<ValidatedFieldsResult> {
    const schema = z.object({
      mainImageUrl: z
        .string()
        .url("Main Image URL must be a valid URL")
        .or(z.literal(""))
        .refine(mainImage => {
          if (!mainImage) return true
          return this.validationService.isImageUrl(mainImage)
        }),
      thumbnailImageUrl: z
        .string()
        .url("Thumbnail Image URL must be a valid URL")
        .or(z.literal(""))
        .refine(thumbnailImageUrl => {
          if (!thumbnailImageUrl) return true
          return this.validationService.isImageUrl(thumbnailImageUrl)
        }),
    })

    return schema.parseAsync({
      mainImageUrl: fields.getTextInputValue("mainImageUrl"),
      thumbnailImageUrl: fields.getTextInputValue("thumbnailImageUrl"),
    })
  }
}

interface ValidatedFieldsResult {
  mainImageUrl: string
  thumbnailImageUrl: string
}
