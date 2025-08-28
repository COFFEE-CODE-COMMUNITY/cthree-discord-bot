import { StringOption } from "necord"

export class ShowEmbedDto {
  @StringOption({
    name: "name",
    description: "Name of the embed",
    required: true,
    autocomplete: true,
  })
  public name!: string
}
