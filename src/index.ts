import { Client, Collection, GatewayIntentBits, Interaction, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { register, transfer, balance, shop, info, buy, player, mypacks, open, github, myplayers, sell } from './functions/functions.export'
import { channelList, updateUserPacks, usersList } from './database/dbQuerys'

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

let lastHour = new Date().getUTCHours()

setInterval(async () => {
    const currentHour = new Date().getUTCHours()

    if (currentHour !== lastHour) {
        lastHour = currentHour

        try {
            const usersArray = await usersList()

            for (const user of usersArray) {
                await updateUserPacks(user.user_id, 'user_commonPacks', true)
                await updateUserPacks(user.user_id, 'user_rarePacks', true)
            }

            console.log('Pacotes atualizados com sucesso')
        } catch (err) {
            console.error('Erro ao atualizar pacotes', err)
        }
    }
}, 60000)

client.once('ready', () => {
    console.log(`Bot online como ${client.user?.tag}`)
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`Command not found: ${interaction.commandName}`)
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error('Error on executing command', error)
        await interaction.reply({ content: 'Error on executing command', ephemeral: true })
    }
})

const messageCommands: Record<string, Function> = {
    '&register': register,
    '&reg': register,
    '&transfer': transfer,
    '&pix': transfer,
    '&balance': balance,
    '&bal': balance,
    '&shop': shop,
    '&s': shop,
    '&info': info,
    '&i': info,
    '&buy': buy,
    '&player': player,
    '&p': player,
    '&mypacks': mypacks,
    '&mp': mypacks,
    '&open': open,
    '&o': open,
    '&github': github,
    '&git': github,
    '&myplayers': myplayers,
    '&mpl': myplayers,
    '&sell': sell,
    '&sl': sell
}

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return

    const guild_id = message.guild?.id
    const channel_id = message.channel.id

    if (!guild_id || !(await canBotSendMessage(guild_id, channel_id))) return

    const command = Object.keys(messageCommands).find(cmd => message.content.startsWith(cmd))
    if (command) {
        await messageCommands[command](message)
    }
})

async function canBotSendMessage(guild_id: string, channel_id: string): Promise<boolean> {
    const guildChannels = await channelList(guild_id)

    return guildChannels.some(channel => channel.channel_id === channel_id)
}

client.login(process.env.DISCORD_TOKEN)