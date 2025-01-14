"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function embedPagination(interaction, pages, string, disapear = false, time = 20000) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        try {
            if (!interaction || !pages || pages.length === 0)
                throw new Error('No pages found');
            if (pages.length === 1) {
                return await interaction.editReply({ content: string, embeds: [pages[0].data], components: [] });
            }
            let index = 0;
            const first = new discord_js_1.ButtonBuilder()
                .setCustomId('pagefirst')
                .setEmoji('⏮️')
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setDisabled(true);
            const prev = new discord_js_1.ButtonBuilder()
                .setCustomId('pageprev')
                .setEmoji('⬅️')
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setDisabled(true);
            const pageCount = new discord_js_1.ButtonBuilder()
                .setCustomId('pagecount')
                .setLabel(`${index + 1}/${pages.length}`)
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(true);
            const next = new discord_js_1.ButtonBuilder()
                .setCustomId('pagenext')
                .setEmoji('➡️')
                .setStyle(discord_js_1.ButtonStyle.Primary);
            const last = new discord_js_1.ButtonBuilder()
                .setCustomId('pagelast')
                .setEmoji('⏩')
                .setStyle(discord_js_1.ButtonStyle.Primary);
            const buttons = new discord_js_1.ActionRowBuilder().addComponents(first, prev, pageCount, next, last);
            const msg = await interaction.reply({ content: string, embeds: [pages[index].data], components: [buttons] });
            const collector = msg.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time
            });
            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `You can't use this button!`, ephemeral: true });
                }
                await i.deferUpdate();
                if (i.customId === 'pagefirst')
                    index = 0;
                else if (i.customId === 'pageprev' && index > 0)
                    index--;
                else if (i.customId === 'pagenext' && index < pages.length - 1)
                    index++;
                else if (i.customId === 'pagelast')
                    index = pages.length - 1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
                first.setDisabled(index === 0);
                prev.setDisabled(index === 0);
                next.setDisabled(index === pages.length - 1);
                last.setDisabled(index === pages.length - 1);
                await msg.edit({ content: string, embeds: [pages[index].data], components: [buttons] }).catch(console.log);
                collector.resetTimer();
            });
            collector.on("end", async () => {
                if (!disapear) {
                    await msg.edit({ embeds: [pages[index].data], components: [] });
                }
                else {
                    await msg.delete();
                }
            });
            return msg;
        }
        catch (e) {
            console.error(e);
            await interaction.reply({ content: 'Error on loading pages', ephemeral: true });
        }
    }
    if (interaction instanceof discord_js_1.Message) {
        try {
            if (!interaction || !pages || pages.length === 0)
                throw new Error('No pages found');
            if (pages.length === 1) {
                return await interaction.edit({ content: string, embeds: [pages[0].data], components: [] });
            }
            let index = 0;
            const first = new discord_js_1.ButtonBuilder()
                .setCustomId('pagefirst')
                .setEmoji('⏮️')
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setDisabled(true);
            const prev = new discord_js_1.ButtonBuilder()
                .setCustomId('pageprev')
                .setEmoji('⬅️')
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setDisabled(true);
            const pageCount = new discord_js_1.ButtonBuilder()
                .setCustomId('pagecount')
                .setLabel(`${index + 1}/${pages.length}`)
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(true);
            const next = new discord_js_1.ButtonBuilder()
                .setCustomId('pagenext')
                .setEmoji('➡️')
                .setStyle(discord_js_1.ButtonStyle.Primary);
            const last = new discord_js_1.ButtonBuilder()
                .setCustomId('pagelast')
                .setEmoji('⏩')
                .setStyle(discord_js_1.ButtonStyle.Primary);
            const buttons = new discord_js_1.ActionRowBuilder().addComponents(first, prev, pageCount, next, last);
            const msg = await interaction.reply({ content: string, embeds: [pages[index].data], components: [buttons] });
            const collector = msg.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time
            });
            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.author.id) {
                    return await i.reply({ content: `You can't use this button!`, ephemeral: true });
                }
                await i.deferUpdate();
                if (i.customId === 'pagefirst')
                    index = 0;
                else if (i.customId === 'pageprev' && index > 0)
                    index--;
                else if (i.customId === 'pagenext' && index < pages.length - 1)
                    index++;
                else if (i.customId === 'pagelast')
                    index = pages.length - 1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
                first.setDisabled(index === 0);
                prev.setDisabled(index === 0);
                next.setDisabled(index === pages.length - 1);
                last.setDisabled(index === pages.length - 1);
                await msg.edit({ content: string, embeds: [pages[index].data], components: [buttons] }).catch(console.log);
                collector.resetTimer();
            });
            collector.on("end", async () => {
                if (!disapear) {
                    await msg.edit({ embeds: [pages[index].data], components: [] });
                }
                else {
                    await msg.delete();
                }
            });
            return msg;
        }
        catch (e) {
            console.error(e);
            await interaction.reply('Error on loading pages');
        }
    }
}
exports.default = embedPagination;
