"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function deleteplayer(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const player_name = interaction.options.get('playername')?.value?.toString();
    if (!player_name) {
        interaction.reply({ content: 'Error fetching player', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const player_db = await (0, dbQuerys_1.findPlayer)(player_name);
    if (!player_db) {
        interaction.reply({ content: 'Player not found on database', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    try {
        await (0, dbQuerys_1.deletePlayer)(player_db.player_name);
        interaction.reply(`Player **${player_db.player_name}** deleted successfully`);
    }
    catch (err) {
        console.error(`Error when deleting player: ${player_db.player_name}`);
        interaction.reply({ content: 'Error when deleting player', flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
}
exports.default = deleteplayer;
