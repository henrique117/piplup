"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function register(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        try {
            await (0, dbQuerys_1.insertUser)(interaction.user.id, interaction.user.username, interaction.user.globalName);
            interaction.reply('User registered!');
        }
        catch (err) {
            interaction.reply({ content: "If you already registered yourself you can use the bot by running other commands! Otherwise, I'm sorry...", flags: discord_js_1.MessageFlags.Ephemeral });
            console.error(`Error on register the user: ${interaction.user.username} | ${interaction.user.id}`);
        }
    }
    if (interaction instanceof discord_js_1.Message) {
        try {
            await (0, dbQuerys_1.insertUser)(interaction.author.id, interaction.author.username, interaction.author.globalName);
            interaction.reply('User registered!');
        }
        catch (err) {
            interaction.reply("If you already registered yourself you can use the bot by running other commands! Otherwise, I'm sorry...");
            console.error(`Error on register the user: ${interaction.author.username} | ${interaction.author.id}`);
        }
    }
}
exports.default = register;
