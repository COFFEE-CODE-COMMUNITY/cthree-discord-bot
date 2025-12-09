import { Injectable } from "@nestjs/common"
import { TakeRole } from "../entities/take-role.entity"
import { TakeRoleRepository } from "../repositories/take-role.repository"
import { ITakeRoleService } from "./take-role.service"

@Injectable()
export class TakeRoleServiceImpl implements ITakeRoleService {
  public constructor(private readonly takeRoleRepository: TakeRoleRepository) {}

  public async create(data: Partial<TakeRole>): Promise<TakeRole> {
    const takeRole = this.takeRoleRepository.create(data)
    return await this.takeRoleRepository.save(takeRole)
  }

  public async findById(id: string): Promise<TakeRole | null> {
    return this.takeRoleRepository.findById(id)
  }

  public async findAllByGuild(guildId: string): Promise<TakeRole[]> {
    return this.takeRoleRepository.findAllByGuild(guildId)
  }
}
