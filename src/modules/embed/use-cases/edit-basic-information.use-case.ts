import { Inject, Injectable } from "@nestjs/common"
import { Message, ModalSubmitFields, ModalSubmitInteraction } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"
import { EmbedService } from "../services/embed.service"
import { z, ZodError } from "zod"
import { Logger, LOGGER } from "../../../common/interfaces/logger/logger.interface"

@Injectable()
export class EditBasicInformationUseCase {
  public constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly embedService: EmbedService,
    private readonly embedRepository: EmbedRepository,
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
      const fields = this.validateField(interaction.fields)
      embed.title = fields.title ?? embed.title
      embed.description = fields.description ?? embed.description
      embed.hexColor = fields.color ?? embed.hexColor

      const savedEmbed = await this.embedRepository.save(embed)
      await this.embedService.editEmbedEditorMessage(message, savedEmbed)

      await interaction.deferUpdate()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        await interaction.reply({
          content: `Validation error: ${error.errors.map(e => e.message).join(", ")}`,
          flags: "Ephemeral",
        })
      } else {
        this.logger.error("Failed to edit embed basic information", error, {
          interactionId: interaction.id,
          userId: interaction.user.id,
        })

        await interaction.reply({
          content: "An unexpected error occurred. Please try again later.",
          flags: "Ephemeral",
        })
      }
    }
  }

  private validateField(fields: ModalSubmitFields): ValidateFieldResult {
    const schema = z.object({
      title: z.string({ required_error: "Title is required" }).max(256, "Title must be at most 256 characters"),
      description: z.string().max(4096, "Description must be at most 4096 characters").optional(),
      color: z
        .string()
        .trim()
        .refine(color => {
          if (!color) return true
          return /^#?[0-9A-Fa-f]{6}$/.test(color)
        }, "Color must be a valid hex code")
        .optional(),
    })

    return schema.parse({
      title: fields.getTextInputValue("title"),
      description: fields.getTextInputValue("description"),
      color: fields.getTextInputValue("color"),
    })
  }
}

interface ValidateFieldResult {
  title?: string
  description?: string
  color?: string
}
