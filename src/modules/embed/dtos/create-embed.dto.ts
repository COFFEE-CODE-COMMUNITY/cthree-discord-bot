import { StringOption } from "necord"

export class CreateEmbedDto {
  @StringOption({
    name: "name",
    description: "The name of the embed",
    required: true,
  })
  public name!: string
}
