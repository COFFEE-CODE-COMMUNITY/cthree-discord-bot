import { Repository } from "typeorm"
import { TakeRole } from "../entities/take-role.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class TakeRoleRepository {
  public constructor(
    @InjectRepository(TakeRole)
    private readonly repo: Repository<TakeRole>,
  ) {}

  public create(data: Partial<TakeRole>): TakeRole {
    return this.repo.create(data)
  }

  public save(entity: TakeRole): Promise<TakeRole> {
    return this.repo.save(entity)
  }

  public findById(id: string): Promise<TakeRole | null> {
    return this.repo.findOne({ where: { id } })
  }

  public findAllByGuild(guildId: string): Promise<TakeRole[]> {
    return this.repo.find({ where: { guildId } })
  }
}
