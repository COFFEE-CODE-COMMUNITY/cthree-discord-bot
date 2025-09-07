import { Injectable } from "@nestjs/common"
import { ConfessionSlashCommand } from "../decorators/confession-slash-command.decorator"

@Injectable()
@ConfessionSlashCommand()
export class ConfessionCommand {

}
