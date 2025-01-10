import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { transfer } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer coins to a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to transfer coins')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('ammount')
            .setDescription('Ammount to transfer')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await transfer(interaction)
    }
}