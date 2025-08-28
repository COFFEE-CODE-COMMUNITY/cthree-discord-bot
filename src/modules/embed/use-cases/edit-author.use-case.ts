import { Injectable } from "@nestjs/common"
import { Message, ModalSubmitFields, ModalSubmitInteraction } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"
import { ValidationService } from "../../../common/services/validation.service"
import { z } from "zod"
import { EmbedService } from "../services/embed.service"

@Injectable()
export class EditAuthorUseCase {
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
      embed.author = fields.author ?? embed.author
      embed.authorIconUrl = fields.authorIconUrl ?? embed.authorIconUrl

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
      author: z.string().max(256, "Author must be at most 256 characters long.").optional().or(z.literal("")),
      authorIconUrl: z
        .string()
        .url()
        .max(256, "Author Icon URL must be at most 256 characters long.")
        .or(z.literal(""))
        .refine(async authorIconUrl => {
          if (!authorIconUrl) return true
          return this.validationService.isImageUrl(authorIconUrl)
        }, "Author Icon URL must be a valid image URL."),
    })

    return schema.parseAsync({
      author: fields.getTextInputValue("author"),
      authorIconUrl: fields.getTextInputValue("authorIconUrl"),
    })
  }
}

interface ValidatedFieldsResult {
  author?: string
  authorIconUrl?: string
}
