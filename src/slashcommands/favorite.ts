import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { favorite } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('favorite')
        .setDescription('Favorite your players')
        .addStringOption(option => 
            option.setName('query')
            .setDescription("IDs or names of the players you wanna favorite")
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await favorite(interaction)
    }
}