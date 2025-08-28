import { Injectable } from "@nestjs/common"
import { EmbedService } from "../services/embed.service"
import { Message, ModalSubmitFields, ModalSubmitInteraction } from "discord.js"
import { EmbedRepository } from "../repositories/embed.repository"
import { z } from "zod"
import { ValidationService } from "../../../common/services/validation.service"

@Injectable()
export class EditFooterUseCase {
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
      const fields = await this.validateFields(interaction.fields)
      embed.footerText = fields.footerText
      embed.footerIconUrl = fields.footerIconUrl
      embed.footerTimestamp = fields.footerTimestamp

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
      return
    }
  }

  private async validateFields(fields: ModalSubmitFields): Promise<ValidatedFieldsResult> {
    const schema = z.object({
      footerText: z.string().max(2048).or(z.literal("")),
      footerIconUrl: z
        .string()
        .url()
        .or(z.literal(""))
        .refine(footerIconUrl => {
          if (!footerIconUrl) return true
          return this.validationService.isImageUrl(footerIconUrl)
        }),
      footerTimestamp: z.enum(["yes", "no"]).transform(footerTimestamp => {
        return footerTimestamp === "yes"
      }),
    })

    return schema.parseAsync({
      footerText: fields.getTextInputValue("footerText"),
      footerIconUrl: fields.getTextInputValue("footerIconUrl"),
      footerTimestamp: fields.getTextInputValue("footerTimestamp"),
    })
  }
}

interface ValidatedFieldsResult {
  footerText: string
  footerIconUrl: string
  footerTimestamp: boolean
}
