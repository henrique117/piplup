"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('unsetchannel')
        .setDescription("Unset this channel so the bot can't send messages here!"),
    async execute(interaction) {
        await (0, functions_export_1.unsetchannel)(interaction);
    }
};
