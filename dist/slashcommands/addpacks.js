"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_export_1 = require("../functions/functions.export");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('addpacks')
        .setDescription('Add a pack to a user (Admin command)')
        .addUserOption(option => option.setName('user')
        .setDescription('User to add packs')
        .setRequired(true))
        .addStringOption(option => option.setName('packtype')
        .setDescription('Pack type')
        .setRequired(true)
        .addChoices({ name: 'Common pack', value: 'common' }, { name: 'Rare pack', value: 'rare' }, { name: 'Epic pack', value: 'epic' }, { name: 'Legendary pack', value: 'legendary' }, { name: 'Ultimate pack', value: 'ultimate' })),
    async execute(interaction) {
        await (0, functions_export_1.addpacks)(interaction);
    }
};
