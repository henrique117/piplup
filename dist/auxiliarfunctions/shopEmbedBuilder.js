"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function shopEmbedBuilder(items) {
    const embedString = items.map(item => `${item.item_id} - ${item.item_name} | ${item.item_cost}`).join('\n') || 'No items in the shop this moment';
    return new discord_js_1.EmbedBuilder()
        .setColor('Aqua')
        .setTitle('Item Shop')
        .setDescription(embedString);
}
exports.default = shopEmbedBuilder;
