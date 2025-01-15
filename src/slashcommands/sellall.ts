import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { sellall } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sellall')
        .setDescription('Sell all of your players'),
    async execute(interaction: CommandInteraction) {
        await sellall(interaction)
    }
}