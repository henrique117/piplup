"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('open')
        .setDescription('Show yours or others coins')
        .addStringOption(option => option.setName('packtype')
        .setDescription('Type of the pack you wanna open')
        .setRequired(true)
        .addChoices({ name: 'Common pack', value: 'common' }, { name: 'Rare pack', value: 'rare' }, { name: 'Epic pack', value: 'epic' }, { name: 'Legendary pack', value: 'legendary' }, { name: 'Ultimate pack', value: 'ultimate' })),
    async execute(interaction) {
        await (0, functions_export_1.open)(interaction);
    }
};
