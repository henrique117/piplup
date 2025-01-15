"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function playerEmbedBuilder(player) {
    const player_db = await (0, dbQuerys_1.findPlayer)(player.player_name);
    const owner = player_db.user_id ? player.user_id : 'No one';
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${player.player_name} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${player.player_pfp}`);
}
exports.default = playerEmbedBuilder;
