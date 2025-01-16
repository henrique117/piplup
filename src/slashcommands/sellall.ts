import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { sellall } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sellall')
        .setDescription('Sell all of your players')
        .addStringOption(option => 
            option.setName('query')
            .setDescription("IDs or names of the players you don't wanna sell")
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await sellall(interaction)
    }
}