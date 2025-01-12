import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { deleteitem } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteitem')
        .setDescription('Delete an item (Admin command)')
        .addIntegerOption(option => 
            option.setName('itemid')
            .setDescription('Item ID')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await deleteitem(interaction)
    }
}