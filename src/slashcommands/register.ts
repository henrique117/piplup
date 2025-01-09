import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { register } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your Dicord account to use the bot'),
    async execute(interaction: CommandInteraction) {
        await register(interaction)
    }
}