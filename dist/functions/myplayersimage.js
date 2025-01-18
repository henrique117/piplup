"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
const auxiliarfunctions_export_1 = require("../auxiliarfunctions/auxiliarfunctions.export");
async function myplayersimage(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const option = interaction.options.get('user');
        let user;
        const thumbnail = option?.user ? option.user.displayAvatarURL({ extension: 'png' }) : interaction.user.displayAvatarURL({ extension: 'png' });
        if (option?.user) {
            user = option.user.id;
        }
        else {
            user = interaction.user.id;
        }
        try {
            const user_db = await (0, dbQuerys_1.findUser)(user);
            const string = option?.user ? 'User mentioned not found in database! Ask them to register first!!' : "You have to register yourself to see your players";
            if (!user_db) {
                interaction.reply({ content: string, flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            const user_players = await (0, dbQuerys_1.myPlayersList)(user_db.user_id);
            if (user_players.length === 0) {
                const playersEmbed = await (0, auxiliarfunctions_export_1.myplayersEmbedBuilder)(user_players, user_db, thumbnail);
                await interaction.reply({ embeds: [playersEmbed] });
                return;
            }
            if (user_players.length === 1) {
                const playersEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(user_players[0]);
                await interaction.reply({ embeds: [playersEmbed] });
                return;
            }
            const playerEmbedPagination = [];
            for (const player of user_players) {
                playerEmbedPagination.push(await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player));
            }
            await (0, auxiliarfunctions_export_1.embedPagination)(interaction, playerEmbedPagination);
        }
        catch (err) {
            interaction.reply({ content: `Error fetching user or players: ${user}`, flags: discord_js_1.MessageFlags.Ephemeral });
            console.error(`Error fetching user or players: ${user}`);
            return;
        }
        return;
    }
    if (interaction instanceof discord_js_1.Message) {
        const option = interaction.mentions.users.first() ? interaction.mentions.users.first() : interaction.author;
        let user;
        if (!option) {
            interaction.reply('Something went wrong... Sorry');
            return;
        }
        const thumbnail = option.displayAvatarURL({ extension: 'png' });
        user = option.id;
        try {
            const string = interaction.author.id != user ? 'User mentioned not found in database! Ask them to register first!!' : "You have to register yourself to see your players";
            const user_db = await (0, dbQuerys_1.findUser)(user);
            if (!user_db) {
                interaction.reply(string);
                return;
            }
            const user_players = await (0, dbQuerys_1.myPlayersList)(user_db.user_id);
            if (user_players.length === 0) {
                const playersEmbed = await (0, auxiliarfunctions_export_1.myplayersEmbedBuilder)(user_players, user_db, thumbnail);
                await interaction.reply({ embeds: [playersEmbed] });
                return;
            }
            if (user_players.length === 1) {
                const playersEmbed = await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(user_players[0]);
                await interaction.reply({ embeds: [playersEmbed] });
                return;
            }
            const playerEmbedPagination = [];
            for (const player of user_players) {
                playerEmbedPagination.push(await (0, auxiliarfunctions_export_1.playerEmbedBuilder)(player));
            }
            await (0, auxiliarfunctions_export_1.embedPagination)(interaction, playerEmbedPagination);
        }
        catch (err) {
            interaction.reply(`Error fetching user or players: ${user}`);
            console.error(`Error fetching user or players: ${user}`, err);
            return;
        }
    }
}
exports.default = myplayersimage;
