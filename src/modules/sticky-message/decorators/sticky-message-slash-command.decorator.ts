import { createCommandGroupDecorator } from "necord"

export const StickyMessageSlashCommand = createCommandGroupDecorator({
  name: "sticky-message",
  description: "Sticky message.",
})
