import { BaseRepository } from "../../../common/base/base.repository"
import { StickyMessage } from "../entities/sticky-message.entity"

export const STICKY_MESSAGE_REPOSITORY = Symbol("StickyMessageRepository")

export interface StickyMessageRepository extends BaseRepository<StickyMessage, string> {
  findByChannelId(channelId: string): Promise<StickyMessage | null>
  updateByChannelId(channelId: string, stickyMessage: StickyMessage): Promise<StickyMessage>
  deleteByChannelId(channelId: string): Promise<void>
  deleteByGuildId(guildId: string): Promise<void>
}
