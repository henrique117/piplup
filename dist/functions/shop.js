"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function shop(interaction) {
    try {
        const items = await (0, dbQuerys_1.itemsList)();
        const shopEmbed = await (0, auxiliarfunctions_export_1.shopEmbedBuilder)(items);
        interaction.reply({ embeds: [shopEmbed] });
    }
    catch (err) {
        if (interaction instanceof discord_js_1.CommandInteraction) {
            interaction.reply({ content: 'Error on fetching items', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Error fetching items list');
        }
        if (interaction instanceof discord_js_1.Message) {
            interaction.reply('Error on fetching items');
            console.error('Error fetching items list');
        }
    }
}
exports.default = shop;
