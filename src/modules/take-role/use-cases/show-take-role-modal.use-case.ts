// import { Injectable } from '@nestjs/common';
// import {
//   ActionRowBuilder,
//   ModalBuilder,
//   TextInputBuilder,
//   TextInputStyle,
//   ChatInputCommandInteraction
// } from 'discord.js';
//
// @Injectable()
// export class ShowTakeRoleModalUseCase {
//   async execute(interaction: ChatInputCommandInteraction) {
//     const modal = new ModalBuilder()
//       .setCustomId('takeRoleModal')
//       .setTitle('Create Take Role Embed');
//
//     // Message
//     const messageInput = new TextInputBuilder()
//       .setCustomId('message')
//       .setLabel('Message (optional)')
//       .setStyle(TextInputStyle.Paragraph)
//       .setPlaceholder('Pesan sebelum embed')
//       .setRequired(false);
//
//     // Embed Title
//     const titleInput = new TextInputBuilder()
//       .setCustomId('embedTitle')
//       .setLabel('Embed Title')
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder('Masukkan judul embed')
//       .setRequired(true);
//
//     // Embed Body
//     const bodyInput = new TextInputBuilder()
//       .setCustomId('embedBody')
//       .setLabel('Embed Body')
//       .setStyle(TextInputStyle.Paragraph)
//       .setPlaceholder('Isi deskripsi embed')
//       .setRequired(true);
//
//     // Embed Color
//     const colorInput = new TextInputBuilder()
//       .setCustomId('embedColor')
//       .setLabel('Embed Color (hex)')
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder('#3498db')
//       .setRequired(false);
//
//     // Image URL
//     const imageInput = new TextInputBuilder()
//       .setCustomId('imageUrl')
//       .setLabel('Image URL (opsional)')
//       .setStyle(TextInputStyle.Short)
//       .setPlaceholder('https://example.com/image.png')
//       .setRequired(false);
//
//     // Bungkus dalam ActionRow (max 1 input per row)
//     const rows = [
//       new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(bodyInput),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput),
//       new ActionRowBuilder<TextInputBuilder>().addComponents(imageInput),
//     ];
//
//     modal.addComponents(rows);
//
//     // Tampilkan modal ke user
//     await interaction.showModal(modal);
//   }
// }
