import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { github } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('The source code of the bot!!'),
    async execute(interaction: CommandInteraction) {
        await github(interaction)
    }
}