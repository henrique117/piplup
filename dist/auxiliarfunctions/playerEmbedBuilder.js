"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const axios_1 = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
async function playerEmbedBuilder(player) {
    const imagePath = path.resolve(__dirname, `assets/pfp.${player.player_pfp.split('.').pop()}`);
    try {
        const response = await axios_1.default.get(player.player_pfp, { responseType: 'arraybuffer' });
        await sharp(response.data).resize(256, 256).toFile(imagePath);
    }
    catch (err) {
        console.error('Error on resizing image');
        throw new Error('Error on resizing image');
    }
    const owner = player.user_id ? (await (0, dbQuerys_1.findUser)(player.user_id)).user_username : 'No one';
    const playerEmbed = new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:flag_${player.player_flag.toLowerCase()}: ${player.player_name} (#${player.player_rank})`)
        .setDescription(`**Value: ${player.player_cost}** :coin:\n\nOwner: ${owner}\nPlayer ID: ${player.player_id}`)
        .setImage(`${imagePath}`);
    if (fs.existsSync(imagePath))
        fs.unlinkSync(imagePath);
    return playerEmbed;
}
exports.default = playerEmbedBuilder;
