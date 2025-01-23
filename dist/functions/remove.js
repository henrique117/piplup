"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function remove(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    try {
        const user = interaction.options.get('user', true);
        const ammount_option = interaction.options.get('ammount', true);
        const ammount = ammount_option.value?.toString();
        if (!user.user) {
            interaction.reply({ content: 'User not found', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const user_db = await (0, dbQuerys_1.findUser)(user.user.id);
        if (!user_db) {
            interaction.reply({ content: 'User not found on database', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        if (!ammount) {
            interaction.reply({ content: 'Use a valid number', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        await (0, dbQuerys_1.updateUserCoins)(user_db.user_id, user_db.user_coins - parseInt(ammount));
        interaction.reply(`**${ammount} :coin:** were removed from **${user.user.globalName}**`);
    }
    catch (err) {
        interaction.reply({ content: 'An error occurred on updating user!', flags: discord_js_1.MessageFlags.Ephemeral });
        console.error('An error occurred on updating user!');
    }
}
exports.default = remove;
