"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function newitem(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const item_name = interaction.options.get('itemname')?.value?.toString();
    const item_description = interaction.options.get('itemdesc')?.value?.toString();
    const item_cost = interaction.options.get('itemcost')?.value?.toString();
    if (!item_name || !item_cost) {
        interaction.reply({ content: 'Error on getting item values', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const item_cost_number = parseInt(item_cost);
    if (item_cost_number < 0) {
        interaction.reply({ content: 'Type a valid cost!', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    if (item_description) {
        await (0, dbQuerys_1.insertItem)(item_name, item_description, item_cost_number);
        interaction.reply(`Item **${item_name}** was added to the database!\n\nCost: **${item_cost}**\nDescription: "${item_description}"`);
        return;
    }
    else {
        await (0, dbQuerys_1.insertItem)(item_name, null, item_cost_number);
        interaction.reply(`Item **${item_name}** was added to the database!\n\nCost: **${item_cost}**`);
        return;
    }
}
exports.default = newitem;
