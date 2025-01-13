"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function shopEmbedBuilder(item) {
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${item.item_name} | ${item.item_cost} coins`)
        .setDescription(item.item_description);
}
exports.default = shopEmbedBuilder;
