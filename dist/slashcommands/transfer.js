"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer coins to a user')
        .addUserOption(option => option.setName('user')
        .setDescription('User to transfer coins')
        .setRequired(true))
        .addIntegerOption(option => option.setName('ammount')
        .setDescription('Ammount to transfer')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.transfer)(interaction);
    }
};
