"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function info(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const item_id = interaction.options.get('itemid')?.value?.toString();
        if (!item_id) {
            interaction.reply({ content: 'Bruh', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Bruh');
            return;
        }
        const item_db = await (0, dbQuerys_1.findItem)(parseInt(item_id));
        if (!item_db) {
            interaction.reply({ content: "There is no item with this ID!", flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const itemEmbed = await (0, auxiliarfunctions_export_1.itemEmbedBuilder)(item_db);
        interaction.reply({ embeds: [itemEmbed] });
    }
    if (interaction instanceof discord_js_1.Message) {
        const regex = /^.+\s\d+$/;
        if (!regex.exec(interaction.content)) {
            interaction.reply('Type a valid ID!');
            return;
        }
        const item_id = interaction.content.split(' ')[1];
        if (!item_id) {
            interaction.reply('Bruh');
            console.error('Bruh');
            return;
        }
        const item_db = await (0, dbQuerys_1.findItem)(parseInt(item_id));
        if (!item_db) {
            interaction.reply("There is no item with this ID!");
            return;
        }
        const itemEmbed = await (0, auxiliarfunctions_export_1.itemEmbedBuilder)(item_db);
        interaction.reply({ embeds: [itemEmbed] });
    }
}
exports.default = info;
