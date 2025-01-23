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
        )
        .addIntegerOption(option => 
            option.setName('quantity')
            .setDescription('How many items you wanna buy')
            .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        await buy(interaction)
    }
}