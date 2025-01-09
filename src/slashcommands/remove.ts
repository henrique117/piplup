import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { remove } from '../functions/functions.export'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove coins from a user (Admin command)')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('User to remove coins')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('ammount')
            .setDescription('Ammount to remove')
            .setRequired(true)
        ),

    async execute(interaction: CommandInteraction) {
        await remove(interaction)
    }
}