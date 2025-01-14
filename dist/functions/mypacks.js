"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function mypacks(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const user = interaction.user.id;
        try {
            const user_db = await (0, dbQuerys_1.findUser)(user);
            if (!user_db) {
                interaction.reply({ content: "You have to register yourself to see your packs", flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_username;
            interaction.reply({ content: `**${name}'s packs**\n\nCommon Packs: ${user_db.user_commonPacks}\nRare Packs: ${user_db.user_rarePacks}\nEpic Packs: ${user_db.user_epicPacks}\nLegendary Packs: ${user_db.user_legendaryPacks}\nUltimate Packs: ${user_db.user_ultimatePacks}` });
        }
        catch (err) {
            interaction.reply({ content: `Error fetching user: ${user}`, flags: discord_js_1.MessageFlags.Ephemeral });
            console.error(`Error fetching user: ${user}`);
            return;
        }
        return;
    }
    if (interaction instanceof discord_js_1.Message) {
        const user = interaction.author.id;
        try {
            const user_db = await (0, dbQuerys_1.findUser)(user);
            if (!user_db) {
                interaction.reply("You have to register yourself to see your packs");
                return;
            }
            const name = user_db.user_globalName ? user_db.user_globalName : user_db.user_username;
            interaction.reply(`**${name}'s packs**\nCommon Packs: ${user_db.user_commonPacks}\nRare Packs: ${user_db.user_rarePacks}\nEpic Packs: ${user_db.user_epicPacks}\nLegendary Packs: ${user_db.user_legendaryPacks}\nUltimate Packs: ${user_db.user_ultimatePacks}`);
        }
        catch (err) {
            interaction.reply(`Error fetching user: ${user}`);
            console.error(`Error fetching user: ${user}`);
            return;
        }
    }
}
exports.default = mypacks;
