"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shop')
        .setDescription('List of the items on the shop'),
    async execute(interaction) {
        await (0, functions_export_1.shop)(interaction);
    }
};
