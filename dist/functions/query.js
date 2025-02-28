"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function add(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    try {
        const query = interaction.options.get('query', true).value;
        if (!query) {
            throw new Error('No query was found');
        }
        const response = await (0, dbQuerys_1.runQuery)(query.toString());
        interaction.reply({ content: response });
    }
    catch (err) {
        interaction.reply({ content: 'An error occurred on running query!', flags: discord_js_1.MessageFlags.Ephemeral });
        console.error('An error occurred on running query!');
    }
}
exports.default = add;
