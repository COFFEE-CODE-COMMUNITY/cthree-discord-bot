import { Collection } from "discord.js"

export const inviteCache = new Collection<string, Collection<string, number>>()
