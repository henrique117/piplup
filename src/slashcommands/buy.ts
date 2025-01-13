import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { buy } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy any item from the shop!')
        .addIntegerOption(option => 
            option.setName('itemid')
            .setDescription('ID of the item')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await buy(interaction)
    }
}