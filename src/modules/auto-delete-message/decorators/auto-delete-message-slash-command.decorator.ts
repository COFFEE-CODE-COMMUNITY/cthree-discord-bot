import { createCommandGroupDecorator } from "necord"

export const AutoDeleteMessageSlashCommand = createCommandGroupDecorator({
  name: "auto-delete-message",
  description: "Auto delete message.",
})
