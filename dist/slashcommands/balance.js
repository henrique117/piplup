"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('balance')
        .setDescription('Show yours or others coins')
        .addUserOption(option => option.setName('user')
        .setDescription('If you wanna see someone else balance')
        .setRequired(false)),
    async execute(interaction) {
        await (0, functions_export_1.balance)(interaction);
    }
};
