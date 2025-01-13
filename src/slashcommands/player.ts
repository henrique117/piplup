import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { player } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Infos about any player')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('ID or name of the player (Type with " " to search by name)')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await player(interaction)
    }
}