"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function deleteitem(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const item = interaction.options.get('itemid')?.value?.toString();
    if (!item) {
        interaction.reply({ content: 'Error fetching item', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const item_db = await (0, dbQuerys_1.findItem)(parseInt(item));
    if (!item_db) {
        interaction.reply({ content: 'Item not found on database', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    try {
        await (0, dbQuerys_1.deleteItem)(item_db.item_id);
        interaction.reply(`Item **${item_db.item_name}** deleted successfully`);
    }
    catch (err) {
        console.error(`Error when deleting item: ${item_db.item_name}`);
        interaction.reply({ content: 'Error when deleting item', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
}
exports.default = deleteitem;
