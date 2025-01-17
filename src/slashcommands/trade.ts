import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { trade } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Trade with a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to trade players')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await trade(interaction)
    }
}