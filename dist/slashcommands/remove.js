"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove coins from a user (Admin command)')
        .addUserOption(option => option.setName('user')
        .setDescription('User to remove coins')
        .setRequired(true))
        .addIntegerOption(option => option.setName('ammount')
        .setDescription('Ammount to remove')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.remove)(interaction);
    }
};
