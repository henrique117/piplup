"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function favorite(interaction) {
    let user;
    if (interaction instanceof discord_js_1.CommandInteraction) {
        user = interaction.user.id;
    }
    else {
        user = interaction.author.id;
    }
    try {
        const user_db = await (0, dbQuerys_1.findUser)(user);
        if (!user_db) {
            if (interaction instanceof discord_js_1.CommandInteraction) {
                interaction.reply({ content: 'You have to register yourself to favorite players!', flags: discord_js_1.MessageFlags.Ephemeral });
            }
            else {
                interaction.reply('You have to register yourself to favorite players!');
            }
            return;
        }
        const query = interaction instanceof discord_js_1.CommandInteraction ? interaction.options.get('query', true).value?.toString().split(' ') : interaction.content.split(' ');
        if (interaction instanceof discord_js_1.Message)
            query?.shift();
        if (!query || query.length < 1) {
            if (interaction instanceof discord_js_1.CommandInteraction) {
                interaction.reply({ content: 'Use the command right: &favorite | &fv [id1] ["name1"]...', flags: discord_js_1.MessageFlags.Ephemeral });
            }
            else {
                interaction.reply('Use the command right: &favorite | &fv [id1] ["name1"]...');
            }
            return;
        }
        const players_favorite = [];
        console.log(query);
        for (const player of query) {
            const id_regex = /^\d+$/;
            const name_regex = /^".+"$/;
            if (id_regex.test(player)) {
                const player_db = await (0, dbQuerys_1.findPlayerById)(parseInt(player));
                console.log(player_db);
                if (!player_db) {
                    if (interaction instanceof discord_js_1.CommandInteraction) {
                        interaction.reply({ content: 'Player not found! Try use those parameters: [id1] ["name1"]...', flags: discord_js_1.MessageFlags.Ephemeral });
                    }
                    else {
                        interaction.reply('Player not found! Try use those parameters: [id1] ["name1"]...');
                    }
                    return;
                }
                if (player_db.user_id != user_db.user_id) {
                    if (interaction instanceof discord_js_1.CommandInteraction) {
                        interaction.reply({ content: `You can't favorite the player: **${player_db.player_name}**!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    }
                    else {
                        interaction.reply(`You can't favorite the player: **${player_db.player_name}**!`);
                    }
                    return;
                }
                player_db.player_name = await (0, auxiliarfunctions_export_1.escapeFormatting)(player_db.player_name);
                players_favorite.push(player_db);
            }
            else if (name_regex.test(player)) {
                const player_db = await (0, dbQuerys_1.findPlayer)(player.split('"')[1].toLowerCase());
                if (!player_db) {
                    if (interaction instanceof discord_js_1.CommandInteraction) {
                        interaction.reply({ content: 'Player not found! Try use those parameters: [id1] ["name1"]...', flags: discord_js_1.MessageFlags.Ephemeral });
                    }
                    else {
                        interaction.reply('Player not found! Try use those parameters: [id1] ["name1"]...');
                    }
                    return;
                }
                if (player_db.user_id != user_db.user_id) {
                    if (interaction instanceof discord_js_1.CommandInteraction) {
                        await interaction.reply({ content: `You can't favorite the player: **${await (0, auxiliarfunctions_export_1.escapeFormatting)(player_db.player_name)}**!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    }
                    else {
                        await interaction.reply(`You can't favorite the player: **${await (0, auxiliarfunctions_export_1.escapeFormatting)(player_db.player_name)}**!`);
                    }
                    return;
                }
                players_favorite.push(player_db);
            }
            else {
                if (interaction instanceof discord_js_1.CommandInteraction) {
                    await interaction.reply({ content: `Incorrect query! Try use those parameters: [id1] ["name1"]...`, flags: discord_js_1.MessageFlags.Ephemeral });
                }
                else {
                    await interaction.reply(`Incorrect query! Try use those parameters: [id1] ["name1"]...`);
                }
                return;
            }
        }
        for (const player of players_favorite) {
            await (0, dbQuerys_1.updatePlayerFav)(player.player_id, true);
        }
        const string = players_favorite.map(p => p.player_name).join(', ');
        interaction.reply(`Players **${string}** favorited!`);
    }
    catch (err) {
        if (interaction instanceof discord_js_1.CommandInteraction) {
            interaction.reply({ content: `Error on favorite function`, flags: discord_js_1.MessageFlags.Ephemeral });
        }
        else {
            interaction.reply(`Error on favorite function`);
        }
        console.error('Error on favorite function', err);
        return;
    }
}
exports.default = favorite;
