import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { deleteU } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a user (Admin command)')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to delete')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await deleteU(interaction)
    }
}