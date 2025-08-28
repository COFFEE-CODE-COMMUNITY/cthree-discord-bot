import { Global, Module } from "@nestjs/common"
import { ValidationService } from "./services/validation.service"

@Global()
@Module({
  providers: [
    ValidationService,
    {
      provide: Map,
      useClass: Map,
    },
  ],
  exports: [ValidationService, Map],
})
export class CommonModule {}
