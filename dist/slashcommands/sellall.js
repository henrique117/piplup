"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('sellall')
        .setDescription('Sell all of your players')
        .addStringOption(option => option.setName('query')
        .setDescription("IDs or names of the players you don't wanna sell")
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.sellall)(interaction);
    }
};
