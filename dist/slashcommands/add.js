"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('add')
        .setDescription('Add coins to a user (Admin command)')
        .addUserOption(option => option.setName('user')
        .setDescription('User to add coins')
        .setRequired(true))
        .addIntegerOption(option => option.setName('ammount')
        .setDescription('Ammount to add')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.add)(interaction);
    }
};
