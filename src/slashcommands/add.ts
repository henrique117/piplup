import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { add } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add coins to a user (Admin command)')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to add coins')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('ammount')
            .setDescription('Ammount to add')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await add(interaction)
    }
}