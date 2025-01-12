"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function balance(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const option = interaction.options.get('user');
        let user;
        if (option?.user) {
            user = option.user;
        }
        else {
            user = interaction.user;
        }
        const user_db = await (0, dbQuerys_1.findUser)(user.id);
        if (!user_db) {
            interaction.reply({ content: `User ${user.username} not found on database`, flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_globalName;
        interaction.reply({ content: `User ${name} has **${user_db.user_coins} coins**`, flags: discord_js_1.MessageFlags.Ephemeral });
    }
    if (interaction instanceof discord_js_1.Message) {
        const option = interaction.mentions.users.first() ? interaction.mentions.users.first() : interaction.author;
        let user;
        if (!option) {
            interaction.reply('Something went wrong... Sorry');
            return;
        }
        user = option;
        const user_db = await (0, dbQuerys_1.findUser)(user.id);
        if (!user_db) {
            interaction.reply(`User ${user.username} not found on database`);
            return;
        }
        const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_globalName;
        interaction.reply(`User ${name} has **${user_db.user_coins} coins**`);
    }
}
exports.default = balance;
