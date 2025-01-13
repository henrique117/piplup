import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { shop } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('List of the items on the shop'),
    async execute(interaction: CommandInteraction) {
        await shop(interaction)
    }
}