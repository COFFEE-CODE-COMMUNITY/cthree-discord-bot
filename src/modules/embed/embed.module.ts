import { Module } from "@nestjs/common"
import { EmbedCommand } from "./commands/embed.command"
import { CreateEmbedUseCase } from "./use-cases/create-embed.use-case"
import { EmbedComponent } from "./components/embed.component"
import { EmbedRepository } from "./repositories/embed.repository"
import { EmbedService } from "./services/embed.service"
import { EditBasicInformationUseCase } from "./use-cases/edit-basic-information.use-case"
import { OnEditBasicInformationButtonClickedUseCase } from "./use-cases/on-edit-basic-information-button-clicked.use-case"
import { EditEmbedUseCase } from "./use-cases/edit-embed.use-case"
import { OnEditAuthorButtonClickedUseCase } from "./use-cases/on-edit-author-button-clicked.use-case"
import { OnEditImagesButtonClickedUseCase } from "./use-cases/on-edit-images-button-clicked.use-case"
import { EditImagesUseCase } from "./use-cases/edit-images.use-case"
import { EditAuthorUseCase } from "./use-cases/edit-author.use-case"
import { ShowEmbedUseCase } from "./use-cases/show-embed.use-case"
import { OnEditFooterButtonClickedUseCase } from "./use-cases/on-edit-footer-button-clicked.use-case"
import { EditFooterUseCase } from "./use-cases/edit-footer.use-case"

@Module({
  providers: [
    // Commands
    EmbedCommand,

    // Components
    EmbedComponent,

    // Repositories
    EmbedRepository,

    // Services
    EmbedService,

    // Use Cases
    CreateEmbedUseCase,
    EditBasicInformationUseCase,
    EditImagesUseCase,
    EditAuthorUseCase,
    EditEmbedUseCase,
    EditFooterUseCase,
    OnEditAuthorButtonClickedUseCase,
    OnEditBasicInformationButtonClickedUseCase,
    OnEditImagesButtonClickedUseCase,
    OnEditFooterButtonClickedUseCase,
    ShowEmbedUseCase,
  ],
})
export class EmbedModule {}
