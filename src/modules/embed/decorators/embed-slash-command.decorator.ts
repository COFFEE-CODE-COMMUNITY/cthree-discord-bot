import { createCommandGroupDecorator } from "necord"

export const EmbedSlashCommand = createCommandGroupDecorator({
  name: "embed",
  description: "Create embed messages.",
})
