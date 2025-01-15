"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function openmultiplepacksEmbedBuilder(players, user, index, user_pfp) {
    const embedString = players.map(player => `${player.player_id} - **${player.player_name} (#${player.player_rank})** | ${player.player_cost} :coin:`).join('\n') || "You don't have any players! Go open some packs!!";
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${user.user_globalName ? user.user_globalName : user.user_username}'s pack - ${index}`)
        .setDescription(embedString)
        .setThumbnail(user_pfp ? user_pfp : 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/393.png');
}
exports.default = openmultiplepacksEmbedBuilder;
