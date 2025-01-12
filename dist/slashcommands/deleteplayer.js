"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('deleteplayer')
        .setDescription('Delete a player (Admin command)')
        .addStringOption(option => option.setName('playername')
        .setDescription('Name of the player you wanna delete')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.deleteplayer)(interaction);
    }
};
