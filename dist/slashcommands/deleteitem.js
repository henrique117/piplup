"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('deleteitem')
        .setDescription('Delete an item (Admin command)')
        .addIntegerOption(option => option.setName('itemid')
        .setDescription('Item ID')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.deleteitem)(interaction);
    }
};
