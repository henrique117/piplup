"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const auxiliarfunctions_export_1 = require("./auxiliarfunctions.export");
async function myplayersEmbedBuilder(players, user, user_pfp) {
    const playerSafeName = [];
    for (const player of players) {
        player.player_name = await (0, auxiliarfunctions_export_1.escapeFormatting)(player.player_name);
        playerSafeName.push(player);
    }
    const embedString = playerSafeName.map(player => `${player.player_id} - ${player.player_name} | ${player.player_cost} :coin:`).join('\n') || "You don't have any players! Go open some packs!!";
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${user.user_globalName ? user.user_globalName : user.user_username}'s players`)
        .setDescription(embedString)
        .setThumbnail(user_pfp ? user_pfp : 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/393.png');
}
exports.default = myplayersEmbedBuilder;
