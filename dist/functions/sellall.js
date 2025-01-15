"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function sellall(interaction) {
    let user = 'bruh';
    if (interaction instanceof discord_js_1.CommandInteraction)
        user = interaction.user.id;
    if (interaction instanceof discord_js_1.Message)
        user = interaction.author.id;
    try {
        const user_db = await (0, dbQuerys_1.findUser)(user);
        if (!user_db) {
            if (interaction instanceof discord_js_1.CommandInteraction)
                interaction.reply({ content: "You have to register yourself to get and sell players", flags: discord_js_1.MessageFlags.Ephemeral });
            if (interaction instanceof discord_js_1.Message)
                interaction.reply("You have to register yourself to get and sell players");
            return;
        }
        const channel = interaction.channel instanceof discord_js_1.TextChannel ? interaction.channel : null;
        const filter = (msg) => msg.author.id === user;
        if (!channel) {
            if (interaction instanceof discord_js_1.CommandInteraction)
                interaction.reply({ content: "Channel not found! Use a valid channel!!", flags: discord_js_1.MessageFlags.Ephemeral });
            if (interaction instanceof discord_js_1.Message)
                interaction.reply("Channel not found! Use a valid channel!!");
            return;
        }
        const player_list = await (0, dbQuerys_1.myPlayersList)(user);
        if (player_list.length < 1) {
            if (interaction instanceof discord_js_1.CommandInteraction)
                interaction.reply({ content: "You don't have any players to sell!", flags: discord_js_1.MessageFlags.Ephemeral });
            if (interaction instanceof discord_js_1.Message)
                interaction.reply("You don't have any players to sell!");
            return;
        }
        interaction.reply('Are you sure you wanna sell everything? (y/n)');
        const collector = channel.createMessageCollector({ filter, time: 30000 });
        collector.on('collect', async (m) => {
            if (m.content.toLocaleLowerCase() === 'y') {
                let sellValue = 0;
                for (const player of player_list) {
                    try {
                        if (player.player_id)
                            await (0, dbQuerys_1.updatePlayerStatus)(player.player_id, 'NULL');
                        if (player.player_cost)
                            sellValue += player.player_cost;
                    }
                    catch (err) {
                        channel.send('Error on sellall');
                        console.error('Error on sellall', err);
                        return;
                    }
                }
                await (0, dbQuerys_1.updateUserCoins)(user, user_db.user_coins + sellValue);
                channel.send(`All players of <@${user}> were sold and are now available to get! Sold for a total of **${sellValue}** :coin:`);
                collector.stop('confirmed');
            }
            else if (m.content.toLocaleLowerCase() === 'n') {
                collector.stop('canceled');
            }
            else {
                return;
            }
        });
        collector.on('end', async (_, reason) => {
            if (reason === 'canceled') {
                await channel.send(`Operation canceled... nothing was sold <@${user}>`);
                return;
            }
            else if (reason === 'confirmed') {
                return;
            }
            else {
                await channel.send(`Timer expired, if you wanna sell everything try again <@${user}>`);
                return;
            }
        });
    }
    catch (err) {
        interaction.reply(`Error on sellall function: ${user}`);
        console.error(`Error on sellall function: ${user}`, err);
        return;
    }
}
exports.default = sellall;
