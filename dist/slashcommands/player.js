"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('player')
        .setDescription('Infos about any player')
        .addStringOption(option => option.setName('query')
        .setDescription('ID or name of the player (Type with " " to search by name)')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.player)(interaction);
    }
};
