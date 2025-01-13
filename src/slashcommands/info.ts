import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { info } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Infos about any item')
        .addIntegerOption(option => 
            option.setName('itemid')
            .setDescription('ID of the item')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await info(interaction)
    }
}