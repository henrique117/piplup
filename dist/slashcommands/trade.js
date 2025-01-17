"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('trade')
        .setDescription('Trade with a user')
        .addUserOption(option => option.setName('user')
        .setDescription('User to trade players')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.trade)(interaction);
    }
};
