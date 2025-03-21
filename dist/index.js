"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const functions_export_1 = require("./functions/functions.export");
const dbQuerys_1 = require("./database/dbQuerys");
const taskQueue_1 = require("./classes/taskQueue");
dotenv.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageReactions
    ]
});
client.commands = new discord_js_1.Collection();
const commandsPath = path.join(__dirname, 'slashcommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`);
    client.commands.set(command.data.name, command);
}
let lastHour = new Date().getUTCHours();
const taskQueue = new taskQueue_1.TaskQueue();
setInterval(async () => {
    const currentHour = new Date().getUTCHours();
    if (currentHour !== lastHour) {
        lastHour = currentHour;
        try {
            const usersArray = await (0, dbQuerys_1.usersList)();
            for (const user of usersArray) {
                await (0, dbQuerys_1.updateUserPacks)(user.user_id, 'user_commonPacks', true);
                await (0, dbQuerys_1.updateUserPacks)(user.user_id, 'user_rarePacks', true);
            }
            console.log('Pacotes atualizados com sucesso');
        }
        catch (err) {
            console.error('Erro ao atualizar pacotes', err);
        }
    }
}, 10000);
client.once('ready', () => {
    console.log(`Bot online como ${client.user?.tag}`);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        return;
    }
    try {
        if ((!interaction.guild?.id || !interaction.channel?.id || !(await canBotSendMessage(interaction.guild.id, interaction.channel.id))) && interaction.commandName !== 'unsetchannel' && interaction.commandName !== 'setchannel') {
            interaction.reply("I can't send messages in this channel :x:");
            return;
        }
        taskQueue.addTask(command.execute, interaction);
    }
    catch (error) {
        console.error('Error on executing command', error);
        await interaction.reply({ content: 'Error on executing command', ephemeral: true });
    }
});
const messageCommands = {
    '&register': functions_export_1.register,
    '&reg': functions_export_1.register,
    '&transfer': functions_export_1.transfer,
    '&pix': functions_export_1.transfer,
    '&balance': functions_export_1.balance,
    '&bal': functions_export_1.balance,
    '&shop': functions_export_1.shop,
    '&s': functions_export_1.shop,
    '&info': functions_export_1.info,
    '&i': functions_export_1.info,
    '&buy': functions_export_1.buy,
    '&player': functions_export_1.player,
    '&p': functions_export_1.player,
    '&mypacks': functions_export_1.mypacks,
    '&mp': functions_export_1.mypacks,
    '&open': functions_export_1.open,
    '&o': functions_export_1.open,
    '&github': functions_export_1.github,
    '&git': functions_export_1.github,
    '&myplayers': functions_export_1.myplayers,
    '&mpl': functions_export_1.myplayers,
    '&sell': functions_export_1.sell,
    '&sl': functions_export_1.sell,
    '&setchannel': functions_export_1.setchannel,
    '&unsetchannel': functions_export_1.unsetchannel,
    '&help': functions_export_1.help,
    '&h': functions_export_1.help,
    '&sellall': functions_export_1.sellall,
    '&sa': functions_export_1.sellall,
    '&trade': functions_export_1.trade,
    '&tr': functions_export_1.trade,
    '&myplayersimage': functions_export_1.myplayersimage,
    '&mpli': functions_export_1.myplayersimage,
    '&favorite': functions_export_1.favorite,
    '&fv': functions_export_1.favorite,
    '&unfavorite': functions_export_1.unfavorite,
    '&unfv': functions_export_1.unfavorite,
};
client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    const guild_id = message.guild?.id;
    const channel_id = message.channel.id;
    if (message.content.toLowerCase().endsWith(' que') || message.content.toLowerCase() === 'que' || message.content.toLowerCase().endsWith('que?')) {
        message.reply('ijo');
        return;
    }
    if (message.content.toLowerCase().trim().startsWith('&roll')) {
        await (0, functions_export_1.roll)(message);
        return;
    }
    const [command] = message.content.trim().split(/\s+/);
    if (messageCommands[command]) {
        if ((!guild_id || !channel_id || !(await canBotSendMessage(guild_id, channel_id)))
            && command !== '&unsetchannel'
            && command !== '&setchannel') {
            message.reply("I can't send messages in this channel :x:");
            return;
        }
        try {
            taskQueue.addTask(messageCommands[command], message);
        }
        catch (err) {
            console.error(`Erro ao executar o comando ${command}:`, err);
            message.reply('Houve um erro ao executar este comando :x:');
        }
    }
});
async function canBotSendMessage(guild_id, channel_id) {
    const guildChannels = await (0, dbQuerys_1.channelList)(guild_id);
    return guildChannels.some(channel => channel.channel_id === channel_id);
}
client.login(process.env.DISCORD_TOKEN);
