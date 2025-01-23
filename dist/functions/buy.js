"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function buy(interaction) {
    if (interaction instanceof discord_js_1.CommandInteraction) {
        const item_id = interaction.options.get('itemid', true).value?.toString();
        const quant_option = interaction.options.get('quantity', false)?.value?.toString();
        const user_id = interaction.user.id;
        let quant = 1;
        if (quant_option) {
            quant = parseInt(quant_option);
        }
        if (!item_id || !user_id) {
            interaction.reply({ content: 'Bruh', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Bruh');
            return;
        }
        try {
            const item_db = await (0, dbQuerys_1.findItem)(parseInt(item_id));
            const user_db = await (0, dbQuerys_1.findUser)(user_id);
            if (!user_db) {
                interaction.reply({ content: "You have to register yourself to buy any items", flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            if (!item_db) {
                interaction.reply({ content: "There is no item with this ID!", flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            if (user_db.user_coins < item_db.item_cost * quant) {
                interaction.reply({ content: "You don't have enough coins to buy!", flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            const newBalance = user_db.user_coins - item_db.item_cost * quant;
            await (0, dbQuerys_1.updateUserCoins)(user_db.user_id, newBalance);
            await (0, dbQuerys_1.newPurchase)(user_db.user_id, item_db.item_id);
            interaction.reply({ content: `You successfully bought **${quant}** items: **${item_db.item_name}!**` });
            const itemName = item_db.item_name.toLowerCase();
            if (itemName.includes('pack')) {
                for (let i = 0; i < quant; i++) {
                    if (itemName.includes('common')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_commonPacks', true);
                    }
                    else if (itemName.includes('rare')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_rarePacks', true);
                    }
                    else if (itemName.includes('epic')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_epicPacks', true);
                    }
                    else if (itemName.includes('legendary')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_legendaryPacks', true);
                    }
                    else if (itemName.includes('ultimate')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_ultimatePacks', true);
                    }
                    else {
                        throw new Error('Invalid pack type');
                    }
                }
            }
        }
        catch (err) {
            interaction.reply({ content: 'Error on buying function', flags: discord_js_1.MessageFlags.Ephemeral });
            console.error('Error on buying function:', interaction.user.id);
            return;
        }
        return;
    }
    if (interaction instanceof discord_js_1.Message) {
        const regex = /^.+\s\d+(\s\d+)?$/;
        if (!regex.exec(interaction.content)) {
            interaction.reply('Type a valid ID!');
            return;
        }
        const item_id = interaction.content.split(' ')[1];
        const quant_option = interaction.content.split(' ')[2];
        const user_id = interaction.author.id;
        let quant = 1;
        if (quant_option) {
            quant = parseInt(quant_option);
        }
        if (!item_id || !user_id) {
            interaction.reply('Bruh');
            console.error('Bruh');
            return;
        }
        try {
            const item_db = await (0, dbQuerys_1.findItem)(parseInt(item_id));
            const user_db = await (0, dbQuerys_1.findUser)(user_id);
            if (!user_db) {
                interaction.reply("You have to register yourself to buy any items");
                return;
            }
            if (!item_db) {
                interaction.reply("There is no item with this ID!");
                return;
            }
            if (user_db.user_coins < item_db.item_cost * quant) {
                interaction.reply("You don't have enough coins to buy this item!");
                return;
            }
            const newBalance = user_db.user_coins - item_db.item_cost * quant;
            await (0, dbQuerys_1.updateUserCoins)(user_db.user_id, newBalance);
            await (0, dbQuerys_1.newPurchase)(user_db.user_id, item_db.item_id);
            interaction.reply(`You successfully bought **${quant}** items: **${item_db.item_name}!**`);
            const itemName = item_db.item_name.toLowerCase();
            if (itemName.includes('pack')) {
                for (let i = 0; i < quant; i++) {
                    if (itemName.includes('common')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_db.user_id, 'user_commonPacks', true);
                    }
                    else if (itemName.includes('rare')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_rarePacks', true);
                    }
                    else if (itemName.includes('epic')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_epicPacks', true);
                    }
                    else if (itemName.includes('legendary')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_legendaryPacks', true);
                    }
                    else if (itemName.includes('ultimate')) {
                        await (0, dbQuerys_1.updateUserPacks)(user_id, 'user_ultimatePacks', true);
                    }
                    else {
                        throw new Error('Invalid pack type');
                    }
                }
            }
        }
        catch (err) {
            interaction.reply('Error on the purchase function');
            console.error('Error on the purchase function:', interaction.author.id);
            return;
        }
    }
}
exports.default = buy;
