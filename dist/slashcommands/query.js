"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('query')
        .setDescription('Run a SQL query (Admin command)')
        .addStringOption(option => option.setName('query')
        .setDescription('The SQL')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.query)(interaction);
    }
};
