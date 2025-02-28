import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { query } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('query')
        .setDescription('Run a SQL query (Admin command)')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('The SQL')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await query(interaction)
    }
}