import { EmbedAutocompleteInterceptor } from "./embed-autocomplete.interceptor"
import { EmbedRepository } from "../repositories/embed.repository"
import { AutocompleteInteraction, ApplicationCommandOptionChoiceData } from "discord.js"
import { Embed } from "../entities/embed.entity"

describe("EmbedAutocompleteInterceptor", (): void => {
  let interceptor: EmbedAutocompleteInterceptor
  let embedRepository: EmbedRepository

  beforeEach((): void => {
    embedRepository = {
      findByGuildId: jest.fn(),
    } as unknown as EmbedRepository

    interceptor = new EmbedAutocompleteInterceptor(embedRepository)
  })

  it("should respond with filtered embed names (case-insensitive, max 25)", async (): Promise<void> => {
    const embeds: Embed[] = []

    for (let i = 0; i < 30; i++) {
      embeds.push({ name: "Embed" + i } as Embed)
    }

    const interaction = {
      guildId: "123456",
      options: {
        getFocused: (): { name: string; value: string } => ({
          name: "name",
          value: "embed",
        }),
      },
      respond: jest.fn(),
    } as unknown as AutocompleteInteraction

    ;(embedRepository.findByGuildId as jest.Mock).mockResolvedValue(embeds)

    await interceptor.transformOptions(interaction)

    expect(embedRepository.findByGuildId).toHaveBeenCalledWith("123456")
    expect(interaction.respond).toHaveBeenCalledWith(
      embeds
        .map((e: Embed): string => e.name)
        .filter((n: string): boolean => n.toLowerCase().startsWith("embed"))
        .slice(0, 25)
        .map((n: string): ApplicationCommandOptionChoiceData => ({ name: n, value: n })),
    )
  })

  it("should respond with empty list when focused option is not 'name'", async (): Promise<void> => {
    const interaction = {
      guildId: "123456",
      options: {
        getFocused: (): { name: string; value: string } => ({
          name: "other",
          value: "irrelevant",
        }),
      },
      respond: jest.fn(),
    } as unknown as AutocompleteInteraction

    await interceptor.transformOptions(interaction)

    expect(embedRepository.findByGuildId).not.toHaveBeenCalled()
    expect(interaction.respond).toHaveBeenCalledWith([])
  })

  it("should respond with empty list when guildId is null", async (): Promise<void> => {
    const interaction = {
      guildId: null,
      options: {
        getFocused: (): { name: string; value: string } => ({
          name: "name",
          value: "test",
        }),
      },
      respond: jest.fn(),
    } as unknown as AutocompleteInteraction

    ;(embedRepository.findByGuildId as jest.Mock).mockResolvedValue([])

    await interceptor.transformOptions(interaction)

    expect(embedRepository.findByGuildId).toHaveBeenCalledWith("")
    expect(interaction.respond).toHaveBeenCalledWith([])
  })
})
