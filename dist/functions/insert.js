"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const apiCalls_1 = require("../api/apiCalls");
async function insert(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const api = new apiCalls_1.default();
    const id = interaction.options.get('playerid')?.value?.toString();
    const regex = /^\d+/;
    if (!id)
        return;
    if (!regex.exec(id)) {
        interaction.reply({ content: 'Are you dumb? You progammed it!', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const player = await api.getPlayerById(id);
    if (!player) {
        interaction.reply({ content: 'Player not found', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    try {
        await (0, dbQuerys_1.insertPlayer)(player.player_name, player.player_rank, player.player_pfp, player.player_flag);
        interaction.reply(`Player **${player.player_name}** registered successfully!`);
    }
    catch (err) {
        console.error(`Error on inserting player: ${player.player_name}`, err);
        interaction.reply({ content: 'Error on inserting player', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
}
exports.default = insert;
