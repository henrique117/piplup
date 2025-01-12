"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a user (Admin command)')
        .addUserOption(option => option.setName('user')
        .setDescription('User to delete')
        .setRequired(true)),
    async execute(interaction) {
        await (0, functions_export_1.deleteU)(interaction);
    }
};
