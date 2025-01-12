"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('insert')
        .setDescription('Insert a player into the DB (Admin command)')
        .addStringOption(option => option.setName('playerid')
        .setDescription('Player ID')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.insert)(interaction);
    }
};
