"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function setchannel(interaction) {
    const user = interaction.member;
    if (user && 'permissions' in user && user.permissions instanceof discord_js_1.PermissionsBitField) {
        if (user.permissions.has('Administrator')) {
            if (interaction.channel?.id && interaction.guild?.id) {
                await (0, dbQuerys_1.newChannel)(interaction.channel.id, interaction.guild.id);
                interaction.reply('Channel set successfully!');
                return;
            }
            else {
                interaction.reply("Oops, I couldn't find this channel");
                return;
            }
        }
        else {
            interaction.reply("You have to be a server Administrator to run this command!");
            return;
        }
    }
    else {
        return;
    }
}
exports.default = setchannel;
