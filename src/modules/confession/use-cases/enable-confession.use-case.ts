// import {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   ChatInputCommandInteraction,
//   EmbedBuilder,
//   TextChannel
// } from "discord.js"
// import { EnableConfessionDto } from "../dtos/enable-confession.dto"
// import { CONFESSION_SERVICE, IConfessionService } from "../services/confession.service"
// import { Inject, Injectable } from "@nestjs/common"
// import { CONFESSION_REPLY, CONFESSION_SHOW_MODAL } from "../constants/custom-id.constant"
// import { LOGGER, Logger } from "../../../common/interfaces/logger/logger.interface"
//
// @Injectable()
// export class EnableConfessionUseCase {
//   public constructor(
//     @Inject(CONFESSION_SERVICE) private readonly confessionService: IConfessionService,
//     @Inject(LOGGER) private readonly logger: Logger,
//   ) {}
//
//   public async execute(interaction: ChatInputCommandInteraction, option: EnableConfessionDto): Promise<void> {
//     const guildId = interaction.guildId!
//     const channel = option.channel as TextChannel
//
//     let config = await this.confessionService.getConfessionChannel(guildId)
//
//     const makeConfessionBtn = new ButtonBuilder()
//       .setCustomId(CONFESSION_SHOW_MODAL)
//       .setLabel('Make a Confession')
//       .setStyle(ButtonStyle.Primary)
//
//     const replyConfessionBtn = new ButtonBuilder()
//       .setCustomId(CONFESSION_REPLY)
//       .setLabel('Reply')
//       .setStyle(ButtonStyle.Primary)
//
//     const row = new ActionRowBuilder<ButtonBuilder>()
//       .addComponents(makeConfessionBtn, replyConfessionBtn)
//
//     const embed = new EmbedBuilder()
//       .setTitle('Anonymous Confession')
//       .setDescription('Klik tombol di bawah untuk membuat confession secara anonim.')
//       .setColor('Blue')
//
//     if (config?.messageId) {
//       try {
//         const existingMsg = await channel.messages.fetch(config.messageId)
//         await existingMsg.edit({ embeds: [embed], components: [row] })
//
//         await interaction.reply({
//           content: `✅ Confession sudah diaktifkan di <#${channel.id}>`,
//           ephemeral: true
//         })
//
//         return
//       } catch (e) {
//         this.logger.warn('Pesan lama tidak ditemukan, membuat baru...')
//       }
//     }
//
//     const newMsg = await channel.send({
//       embeds: [embed],
//       components: [row]
//     })
//
//     await this.confessionService.setConfessionChannel(guildId, channel.id, newMsg.id)
//
//     await interaction.reply({
//       content: `✅ Confession berhasil diaktifkan di <#${channel.id}>`,
//       ephemeral: true
//     })
//   }
// }
