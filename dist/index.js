"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const functions_export_1 = require("./functions/functions.export");
dotenv.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
client.commands = new discord_js_1.Collection();
const commandsPath = path.join(__dirname, "slashcommands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`);
    client.commands.set(command.data.name, command);
}
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
        await command.execute(interaction);
    }
    catch (error) {
        console.error(`Error on executing command: `, error);
        await interaction.reply({ content: 'Error on executing command', ephemeral: true });
    }
});
client.on('messageCreate', async (interaction) => {
    if (interaction.author.bot)
        return;
    if (interaction.content === '&register' || interaction.content === '&reg')
        await (0, functions_export_1.register)(interaction);
    if (interaction.content.startsWith('&transfer') || interaction.content.startsWith('&pix'))
        await (0, functions_export_1.transfer)(interaction);
    if (interaction.content.startsWith('&balance') || interaction.content.startsWith('&bal'))
        await (0, functions_export_1.balance)(interaction);
    if (interaction.content === '&shop' || interaction.content === '&s')
        await (0, functions_export_1.shop)(interaction);
    if (interaction.content.startsWith('&info') || interaction.content.startsWith('&i'))
        await (0, functions_export_1.info)(interaction);
    if (interaction.content.startsWith('&buy'))
        await (0, functions_export_1.buy)(interaction);
    if (interaction.content.startsWith('&player') || interaction.content.startsWith('&p'))
        await (0, functions_export_1.player)(interaction);
});
client.login(process.env.DISCORD_TOKEN);
