import { Client, Collection, GatewayIntentBits, Interaction, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { register, transfer, balance, shop, info, buy } from './functions/functions.export'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, "slashcommands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`)
    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
    console.log(`Bot online como ${client.user?.tag}`)
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if(!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Command not found: ${interaction.commandName}`)
        return
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error on executing command: `, error);
        await interaction.reply({ content: 'Error on executing command', ephemeral: true });
    }
})

client.on('messageCreate', async (interaction: Message) => {
    if(interaction.author.bot) return

    if(interaction.content === '&register' || interaction.content === '&reg') await register(interaction)
    if(interaction.content.startsWith('&transfer') || interaction.content.startsWith('&pix')) await transfer(interaction)
    if(interaction.content.startsWith('&balance') || interaction.content.startsWith('&bal')) await balance(interaction)
    if(interaction.content === '&shop' || interaction.content === '&s') await shop(interaction)
    if(interaction.content.startsWith('&info') || interaction.content.startsWith('&i')) await info(interaction)
    if(interaction.content.startsWith('&buy')) await buy(interaction)

})

client.login(process.env.DISCORD_TOKEN)