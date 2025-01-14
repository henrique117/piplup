"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell any of your players')
        .addStringOption(option => option.setName('query')
        .setDescription('ID or name of the player that you wanna sell')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.sell)(interaction);
    }
};
