import { REST, Routes } from 'discord.js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const commands: any[] = []
const commandsPath = path.join(__dirname, 'slashcommands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string)

const clientId = process.env.DISCORD_CLIENT_ID as string

(async () => {
    try {
        console.log('🔄 Starting the commands deploy...')

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        )

        console.log('✅ Commands deployed successfully!')
    } catch (error) {
        console.error('Error on deploying commands: ', error)
    }
})()