import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { unfavorite } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unfavorite')
        .setDescription('Unfavorite your players')
        .addStringOption(option => 
            option.setName('query')
            .setDescription("IDs or names of the players you wanna unfavorite")
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await unfavorite(interaction)
    }
}