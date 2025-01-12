"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function deleteU(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const user = interaction.options.get('user', true);
    if (!user.user) {
        interaction.reply({ content: 'User not found', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const user_db = await (0, dbQuerys_1.findUser)(user.user.id);
    if (!user_db) {
        interaction.reply({ content: 'User not found on database', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    await (0, dbQuerys_1.deleteUser)(user_db.user_id);
    const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_username;
    interaction.reply(`User **${name}** deleted from database, all players related to him are now available again!`);
}
exports.default = deleteU;
