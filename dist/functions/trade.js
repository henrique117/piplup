"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dbQuerys_1 = require("../database/dbQuerys");
async function trade(interaction) {
    let user_id = 'bruh';
    let target_id = 'bruh';
    if (interaction instanceof discord_js_1.CommandInteraction) {
        user_id = interaction.user.id;
        const option = interaction.options.get('user');
        if (!option?.user) {
            interaction.reply({ content: 'User not found', flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        target_id = option.user.id;
    }
    if (interaction instanceof discord_js_1.Message) {
        user_id = interaction.author.id;
        const option = interaction.mentions.users.first()?.id;
        if (!option) {
            interaction.reply('You have to mention a user to trade');
            return;
        }
        target_id = option;
    }
    try {
        const user_db = await (0, dbQuerys_1.findUser)(user_id);
        const target_db = await (0, dbQuerys_1.findUser)(target_id);
        if (!user_db) {
            if (interaction instanceof discord_js_1.CommandInteraction)
                interaction.reply({ content: 'User not registered! Use &reg to register yourself!', flags: discord_js_1.MessageFlags.Ephemeral });
            if (interaction instanceof discord_js_1.Message)
                interaction.reply('User not registered! Use &reg to register yourself!');
            return;
        }
        if (!target_db) {
            if (interaction instanceof discord_js_1.CommandInteraction)
                interaction.reply({ content: "User not registered! You're trying to trade with someone not registered!", flags: discord_js_1.MessageFlags.Ephemeral });
            if (interaction instanceof discord_js_1.Message)
                interaction.reply("User not registered! You're trying to trade with someone not registered!");
            return;
        }
        const channel = interaction.channel instanceof discord_js_1.TextChannel ? interaction.channel : null;
        if (!channel) {
            interaction.reply("Channel not found! Use a valid channel!!");
            return;
        }
        await sendTradeInvite(channel, user_db, target_db, interaction);
    }
    catch (err) {
        if (interaction instanceof discord_js_1.CommandInteraction)
            interaction.reply({ content: 'Error on trade function', flags: discord_js_1.MessageFlags.Ephemeral });
        if (interaction instanceof discord_js_1.Message)
            interaction.reply('Error on trade function');
        console.error('Error on trade function', err);
        return;
    }
}
exports.default = trade;
async function sendTradeInvite(channel, user, target, interaction) {
    const msg = await channel.send(`<@${user.user_id}> wants to trade with you <@${target.user_id}>!\n\n✅ To accept\n❌ To refuse`);
    await msg.react('✅');
    await msg.react('❌');
    const filter = (reaction, user) => {
        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === target.user_id;
    };
    const collector = msg.createReactionCollector({ filter: filter, time: 20000 });
    collector.on('collect', (reaction) => {
        if (reaction.emoji.name === '❌') {
            collector.stop('canceled');
        }
        else {
            collector.stop('confirmed');
        }
    });
    collector.on('end', async (_, reason) => {
        if (reason === 'canceled') {
            await msg.delete();
            await channel.send(`Trade declined by <@${target.user_id}>`);
            return;
        }
        else if (reason === 'confirmed') {
            await msg.delete();
            const temp = await channel.send(`Trade accepted by <@${target.user_id}>! I'm gonna try to send you both DMs to continue the trade!`);
            setTimeout(() => {
                temp.delete();
            }, 10000);
            const user_offer = [];
            const target_offer = [];
            await collectPlayersOnDM(channel, user, target, interaction, user_offer, target_offer);
        }
        else {
            await msg.delete();
            await channel.send(`Time expired, try to trade again later <@${user.user_id}> and <@${target.user_id}>!!`);
            return;
        }
    });
}
async function collectPlayersOnDM(channel, user_db, target_db, interaction, userOffer, targetOffer) {
    const dmChannel_user = interaction instanceof discord_js_1.CommandInteraction ? await interaction.user.createDM() : await interaction.author.createDM();
    const targetUser = (interaction instanceof discord_js_1.CommandInteraction ? await interaction.options.get('user') : await interaction.mentions.users.first());
    const dmChannel_target = await targetUser.createDM();
    if (!dmChannel_user || !dmChannel_target) {
        channel.send(`Error on open DM channels, please open your DMs before use the trade! <@${user_db.user_id}> <@${target_db.user_id}>`);
        return;
    }
    const userTrade = await dmChannel_user.send('Type the player ID or the "player name" to add them to the trade! Type done to confirm the trade!\n\n**Trade:**');
    const targetTrade = await dmChannel_target.send('Type the player ID or the "player name" to add them to the trade! Type done to confirm the trade!\n\n**Trade:**');
    const dm_filter = (msg) => {
        return !msg.author.bot;
    };
    const createDmCollector = async (channel, user, offer, msgToEdit) => {
        const dmCollector = channel.createMessageCollector({ filter: dm_filter, time: 90000 });
        const id_regex = /^\d+$/;
        const name_regex = /^"(.+)"$/;
        return new Promise((resolve, _) => {
            dmCollector.on('collect', async (dm_message) => {
                if (dm_message.content === 'done') {
                    dm_message.react('👍');
                    dmCollector.stop('done');
                }
                const players = dm_message.content.split(' ');
                for (const player of players) {
                    if (id_regex.test(player)) {
                        dmCollector.resetTimer();
                        const player_db = await (0, dbQuerys_1.findPlayerById)(parseInt(player));
                        if (!player_db) {
                            await dm_message.reply(`Player ${player} not found! Type a valid ID or a valid "name"`);
                            return;
                        }
                        if (player_db.user_id !== user.user_id) {
                            await dm_message.reply(`You can't trade the player: ${player_db.player_name}`);
                            return;
                        }
                        offer.push(player_db);
                        await dm_message.react('✅');
                    }
                    else if (name_regex.test(player)) {
                        dmCollector.resetTimer();
                        const player_db = await (0, dbQuerys_1.findPlayer)(player.split('"')[1].toLowerCase());
                        if (!player_db) {
                            await dm_message.reply(`Player ${player} not found! Type a valid ID or a valid "name"`);
                            return;
                        }
                        if (player_db.user_id !== user.user_id) {
                            await dm_message.reply(`You can't trade the player: ${player_db.player_name}`);
                            return;
                        }
                        offer.push(player_db);
                        await dm_message.react('✅');
                    }
                    else {
                        return;
                    }
                }
                const string = offer.map((p) => p.player_name).join('\n');
                await msgToEdit.edit(`Type the player ID or the "player name" to add them to the trade! Type done to confirm the trade!\n\n**Trade:**\n\n${string}`);
            });
            dmCollector.on('end', async (_, reason) => {
                if (reason !== 'done') {
                    await channel.send('Timer expired. Your trade was sent in the current state.');
                    resolve();
                    return;
                }
                resolve();
            });
        });
    };
    try {
        await Promise.all([
            createDmCollector(dmChannel_user, user_db, userOffer, userTrade),
            createDmCollector(dmChannel_target, target_db, targetOffer, targetTrade)
        ]);
        const userString = userOffer.map((p) => `- **${p.player_name} (#${p.player_rank}): ${p.player_cost} :coin:**`).join('\n');
        const targetString = targetOffer.map((p) => `- **${p.player_name} (#${p.player_rank}): ${p.player_cost} :coin:**`).join('\n');
        await confirmTrade(channel, user_db, target_db, userOffer, targetOffer, userString, targetString);
    }
    catch (error) {
        channel.send('One of the DM collectors failed or timed out.');
    }
    return;
}
async function confirmTrade(channel, user_db, target_db, userOffer, targetOffer, userString, targetString) {
    if (userOffer.length == 0 && targetOffer.length == 0) {
        await channel.send(`No one selected nothing to trade! <@${user_db.user_id}> <@${target_db.user_id}>`);
        return;
    }
    const finalTrade = await channel.send(`Trade ended! <@${user_db.user_id}> <@${target_db.user_id}>\n\n## ${user_db.user_globalName ? user_db.user_globalName : user_db.user_username}'s offer:\n${userString}\n\n**${target_db.user_globalName ? target_db.user_globalName : target_db.user_username}'s offer:**\n${targetString}\n\nReact both to this message with ✅ to confirm the trade or react with ❌ to decline the trade`);
    await finalTrade.react('✅');
    await finalTrade.react('❌');
    const confirmFilter = (reaction, user) => {
        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && (user.id === target_db.user_id || user.id === user_db.user_id);
    };
    let reactionCounter = { user1: false, user2: false };
    const confirmCollector = finalTrade.createReactionCollector({ filter: confirmFilter, time: 30000 });
    confirmCollector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '❌') {
            confirmCollector.stop(`Trade declined by <@${user.id}>`);
        }
        else if (reaction.emoji.name === '✅') {
            if (user.id === user_db.user_id) {
                reactionCounter.user1 = true;
            }
            else if (user.id === target_db.user_id) {
                reactionCounter.user2 = true;
            }
            if (reactionCounter.user1 && reactionCounter.user2) {
                confirmCollector.stop(`Trade confirmed!! Check your players to see! <@${user_db.user_id}> <@${target_db.user_id}>`);
            }
        }
    });
    const tradePlayers = async (players, toUser) => {
        for (const player of players) {
            if (player.player_id)
                await (0, dbQuerys_1.updatePlayerStatus)(player.player_id, toUser.user_id);
        }
    };
    confirmCollector.on('end', async (_, reason) => {
        if (reason.startsWith('Trade declined')) {
            await finalTrade.delete();
            await channel.send(reason);
            return;
        }
        else if (reason.startsWith('Trade confirmed')) {
            await tradePlayers(userOffer, target_db);
            await tradePlayers(targetOffer, user_db);
            await finalTrade.delete();
            await channel.send(reason);
            return;
        }
        else {
            await finalTrade.delete();
            await channel.send(`The time to accept the trade expired! If you both <@${user_db.user_id}> <@${target_db.user_id}> wanna trade start a new one!`);
            return;
        }
    });
}
