"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("./auxiliarfunctions.export");
async function playerEmbedBuilder(player) {
    const player_db = await (0, dbQuerys_1.findPlayer)(player.player_name.toLowerCase());
    let owner = 'No one';
    if (player_db && player_db.user_id) {
        const user_db = await (0, dbQuerys_1.findUser)(player_db.user_id);
        if (user_db) {
            owner = user_db.user_globalName ? user_db.user_globalName : user_db.user_username;
        }
    }
    const safeName = await (0, auxiliarfunctions_export_1.escapeFormatting)(player.player_name);
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${safeName} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${player.player_pfp}`);
}
exports.default = playerEmbedBuilder;
