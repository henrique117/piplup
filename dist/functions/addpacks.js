"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function addpacks(interaction) {
    if (interaction.user.id !== '520994132458471438') {
        interaction.reply({ content: "You don't have permissions to use this command", flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }
    const user = interaction.options.get('user', true).user?.id;
    const pack_type = interaction.options.get('packtype', true).value?.toString();
    if (!user || !pack_type) {
        interaction.reply({ content: 'Bruh', flags: discord_js_1.MessageFlags.Ephemeral });
        console.error('Bruh');
        return;
    }
    try {
        const user_db = await (0, dbQuerys_1.findUser)(user);
        if (!user_db) {
            interaction.reply({ content: "This person isn't registered", flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        if (pack_type.includes('common')) {
            await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_commonPacks', true);
        }
        else if (pack_type.includes('rare')) {
            await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_rarePacks', true);
        }
        else if (pack_type.includes('epic')) {
            await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_epicPacks', true);
        }
        else if (pack_type.includes('legendary')) {
            await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_legendaryPacks', true);
        }
        else if (pack_type.includes('ultimate')) {
            await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_ultimatePacks', true);
        }
        else {
            throw new Error('Invalid pack type');
        }
        interaction.reply({ content: `**1 ${pack_type} pack** added to **${user_db.user_globalName ? user_db.user_globalName : user_db.user_username}**` });
        return;
    }
    catch (err) {
        interaction.reply({ content: 'Error on addpacks function', flags: discord_js_1.MessageFlags.Ephemeral });
        console.error('Error on addpacks function:', interaction.user.id);
        return;
    }
}
exports.default = addpacks;
