"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function embedPagination(interaction, pages, time = 50000) {
    try {
        if (!interaction || !pages || pages.length === 0)
            throw new Error('Nenhuma página encontrada.');
        if (pages.length === 1) {
            return await interaction.editReply({ embeds: [pages[0].data], components: [], fetchReply: true });
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
        const msg = await interaction.reply({ embeds: [pages[index].data], components: [buttons], fetchReply: true });
        const collector = msg.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.author.id) {
                return await i.reply({ content: `Você não pode usar este botão.`, ephemeral: true });
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
            await msg.edit({ embeds: [pages[index].data], components: [buttons] }).catch(console.log);
            collector.resetTimer();
        });
        collector.on("end", async () => {
            await msg.edit({ embeds: [pages[index].data], components: [] });
        });
        return msg;
    }
    catch (e) {
        console.error(e);
    }
}
exports.default = embedPagination;
