import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { balance } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Show yours or others coins')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('If you wanna see someone else balance')
            .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        await balance(interaction)
    }
}