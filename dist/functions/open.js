"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function open(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const pack_type = interaction.options.get('packtype', true).value?.toString();
        const user_db = await (0, dbQuerys_1.findUser)(interaction.user.id);
        if (!pack_type) {
            interaction.reply({ content: 'Bruh', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Bruh');
            return;
        }
        if (!user_db) {
            interaction.reply({ content: 'You have to register yourself to open packs!', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        switch (pack_type) {
            case 'common':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'rare':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'epic':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'legendary':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'ultimate':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply({ content: `You don't have any ${pack_type} packs!`, flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            default:
                throw new Error('Invalid pack type');
        }
        try {
            const players = await (0, dbQuerys_1.getPlayersForPack)(pack_type);
            players.sort((a, b) => b.player_rank - a.player_rank);
            const packEmbeds = [];
            let repeatedCardsValue = 0;
            for (const player of players) {
                const playerEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player);
                packEmbeds.push(playerEmbed);
                if (!player.player_id || !player.player_cost) {
                    interaction.reply({ content: 'Bruh that condition is impossible', flags: discord_js_1.MessageFlags.Ephemeral });
                    return;
                }
                if (!player.user_id) {
                    await (0, dbQuerys_1.updatePlayerStatus)(player.player_id, user_db.user_id);
                }
                else {
                    await (0, dbQuerys_1.updateUserCoins)(user_db.user_id, user_db.user_coins + player.player_cost);
                    repeatedCardsValue += player.player_cost;
                }
            }
            await (0, auxiliarfunctions_export_1.embedPagination)(interaction, packEmbeds, `Your ${pack_type} pack was opened! Check what is inside:`, true);
            if (repeatedCardsValue > 0)
                await interaction.followUp(`Some cards of your pack already has an owner... so you get their value: **+${repeatedCardsValue}** :coin:`);
            return;
        }
        catch (err) {
            interaction.reply({ content: 'Error on open function', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Error on open function:', interaction.user.id);
            return;
        }
    }
    if (interaction instanceof discord_js_1.Message) {
        const regex = /^.+\s[a-zA-z]+$/;
        if (!regex.exec(interaction.content)) {
            interaction.reply('Invalid command input');
            return;
        }
        const pack_type = interaction.content.split(' ')[1].toLowerCase();
        const user_db = await (0, dbQuerys_1.findUser)(interaction.author.id);
        if (!pack_type) {
            interaction.reply('Bruh');
            console.error('Bruh');
            return;
        }
        if (!user_db) {
            interaction.reply('You have to register yourself to open packs!');
            return;
        }
        switch (pack_type) {
            case 'common':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`);
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'rare':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`);
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'epic':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`);
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'legendary':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`);
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            case 'ultimate':
                if (user_db.user_commonPacks < 1) {
                    interaction.reply(`You don't have any ${pack_type} packs!`);
                    return;
                }
                else {
                    await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, `user_${pack_type}Packs`, false);
                }
                break;
            default:
                interaction.reply('Write a valid pack type!!');
                return;
        }
        try {
            const players = await (0, dbQuerys_1.getPlayersForPack)(pack_type);
            players.sort((a, b) => b.player_rank - a.player_rank);
            const packEmbeds = [];
            let repeatedCardsValue = 0;
            for (const player of players) {
                const playerEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player);
                packEmbeds.push(playerEmbed);
                if (!player.player_id || !player.player_cost) {
                    interaction.reply('Bruh that condition is impossible');
                    return;
                }
                if (!player.user_id) {
                    await (0, dbQuerys_1.updatePlayerStatus)(player.player_id, user_db.user_id);
                }
                else {
                    await (0, dbQuerys_1.updateUserCoins)(user_db.user_id, user_db.user_coins + player.player_cost);
                    repeatedCardsValue += player.player_cost;
                }
            }
            await (0, auxiliarfunctions_export_1.embedPagination)(interaction, packEmbeds, `Your ${pack_type} pack was opened! Check what is inside:`, true);
            if (repeatedCardsValue > 0) {
                if (interaction.channel.isSendable())
                    await interaction.channel.send(`Some cards of your pack already has an owner... so you get their value: **+${repeatedCardsValue}** :coin:`);
            }
            return;
        }
        catch (err) {
            interaction.reply('Error on open function');
            console.error('Error on open function:', interaction.author.id);
            return;
        }
    }
}
exports.default = open;
