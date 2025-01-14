import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { sell } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell any of your players')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('ID or name of the player that you wanna sell')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await sell(interaction)
    }
}