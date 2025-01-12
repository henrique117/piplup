"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('newitem')
        .setDescription('Insert a new item into the DB (Admin command)')
        .addStringOption(option => option.setName('itemname')
        .setDescription('Item name')
        .setRequired(true))
        .addIntegerOption(option => option.setName('itemcost')
        .setDescription('Item cost (Coins)')
        .setRequired(true))
        .addStringOption(option => option.setName('itemdesc')
        .setDescription('Item description')
        .setRequired(false)),
    async execute(interaction) {
        await (0, functions_export_1.newitem)(interaction);
    }
};
