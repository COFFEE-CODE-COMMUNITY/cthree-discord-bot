import { TakeRole } from "../entities/take-role.entity"

export const TAKE_ROLE_SERVICE = Symbol("TAKE_ROLE_SERVICE")

export interface ITakeRoleService {
  create(data: Partial<TakeRole>): Promise<TakeRole>
  findById(id: string): Promise<TakeRole | null>
  findAllByGuild(guildId: string): Promise<TakeRole[]>
}
