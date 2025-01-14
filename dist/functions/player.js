"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
const dbQuerys_1 = require("../database/dbQuerys");
async function info(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const query = interaction.options.get('query', true).value?.toString();
        if (!query) {
            interaction.reply({ content: 'Bruh', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Bruh');
            return;
        }
        const id_regex = /^\d+/;
        const name_regex = /^"([a-zA-Z\s\d]+)"$/;
        if (!id_regex.exec(query) && !name_regex.exec(query)) {
            interaction.reply({ content: 'Type a valid ID or use " " to search by name', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        let player_db;
        if (id_regex.exec(query) && !name_regex.exec(query)) {
            player_db = await (0, dbQuerys_1.findPlayerById)(parseInt(query));
        }
        else if (!id_regex.exec(query) && name_regex.exec(query)) {
            player_db = await (0, dbQuerys_1.findPlayer)(query.split('"')[1]);
        }
        else {
            player_db = null;
        }
        if (!player_db) {
            interaction.reply({ content: 'Player not found...', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const playerEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player_db);
        interaction.reply({ embeds: [playerEmbed] });
        return;
    }
    if (interaction instanceof discord_js_1.Message) {
        const query = interaction.content;
        if (!query) {
            interaction.reply('Bruh');
            console.error('Bruh');
            return;
        }
        const id_regex = /^.+\s\d+$/;
        const name_regex = /^.+\s"([a-zA-Z\s\d]+)"$/;
        if (!id_regex.exec(query) && !name_regex.exec(query)) {
            interaction.reply('Type a valid ID or use " " to search by name');
            return;
        }
        let player_db;
        if (id_regex.exec(query) && !name_regex.exec(query)) {
            player_db = await (0, dbQuerys_1.findPlayerById)(parseInt(query.split(' ')[1]));
        }
        else if (!id_regex.exec(query) && name_regex.exec(query)) {
            player_db = await (0, dbQuerys_1.findPlayer)(query.split('"')[1]);
        }
        else {
            player_db = null;
        }
        if (!player_db) {
            interaction.reply('Player not found...');
            return;
        }
        const playerEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player_db);
        interaction.reply({ embeds: [playerEmbed] });
    }
}
exports.default = info;
